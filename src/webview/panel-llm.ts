/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* LLM schemas and request helpers for the dashboard panel. */

import * as vscode from 'vscode';
import { AiSdkClient, OpenAiResponseFormat, BedrockResponseFormat } from '@sosafe-aws/be-lib-ai';

/** Simple message type used by all LLM call sites. */
export type LlmMessage = { role: 'user' | 'assistant'; content: string };

export interface JsonSchemaSpec {
  name: string;
  description?: string;
  schema: Record<string, unknown>;
}

export const SCHEMA_QUIZ: JsonSchemaSpec = {
  name: 'quiz_questions',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            choices: { type: 'array', items: { type: 'string' } },
            correctIndex: { type: 'number' },
            explanation: { type: 'string' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            topic: { type: 'string' },
          },
          required: ['question', 'choices', 'correctIndex', 'explanation', 'difficulty', 'topic'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

export const SCHEMA_CODE_REVIEW: JsonSchemaSpec = {
  name: 'code_comparison_rounds',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            snippetA: { type: 'string' },
            snippetB: { type: 'string' },
            betterSnippet: { type: 'string', enum: ['A', 'B'] },
            title: { type: 'string' },
            category: { type: 'string', enum: ['performance', 'safety', 'readability', 'correctness', 'security'] },
            explanation: { type: 'string' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
            language: { type: 'string' },
          },
          required: ['snippetA', 'snippetB', 'betterSnippet', 'title', 'category', 'explanation', 'difficulty', 'language'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

export const SCHEMA_DID_YOU_KNOW: JsonSchemaSpec = {
  name: 'did_you_know_facts',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fact: { type: 'string' },
            project: { type: 'string' },
            category: { type: 'string', enum: ['performance', 'api', 'pitfall', 'config', 'debug'] },
          },
          required: ['fact', 'project', 'category'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

export const SCHEMA_RESOURCES: JsonSchemaSpec = {
  name: 'learning_resources',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            url: { type: 'string' },
            type: { type: 'string' },
            reason: { type: 'string' },
          },
          required: ['title', 'url', 'type', 'reason'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

export const SCHEMA_TRIAGE: JsonSchemaSpec = {
  name: 'skill_triage',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            verdict: { type: 'string', enum: ['strong', 'maybe', 'skip'] },
            reason: { type: 'string' },
            suggestedSkillName: { type: ['string', 'null'] },
          },
          required: ['id', 'verdict', 'reason', 'suggestedSkillName'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

/** JSON schema for LLM-generated Claude Code customization suggestions. */
export const SCHEMA_CLAUDE_SUGGESTIONS: JsonSchemaSpec = {
  name: 'claude_suggestions',
  description: 'Claude Code customization suggestions based on developer workflow patterns',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            kind: { type: 'string', enum: ['claude-md', 'slash-command', 'hook', 'mcp-server'] },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            reason: { type: 'string' },
          },
          required: ['id', 'kind', 'title', 'description', 'content', 'reason'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

/* ARCHIVED: SCHEMA_CATALOG_PICKS was used with the awesome-copilot catalog triage flow.
 * Restore when a Claude Code community catalog exists.
 *
 * export const SCHEMA_CATALOG_PICKS: JsonSchemaSpec = {
 *   name: 'catalog_picks',
 *   schema: {
 *     type: 'object',
 *     properties: {
 *       items: { type: 'array', items: { type: 'object',
 *         properties: { id: { type: 'string' }, reason: { type: 'string' } },
 *         required: ['id', 'reason'], additionalProperties: false } },
 *     },
 *     required: ['items'], additionalProperties: false,
 *   },
 * };
 */

export const SCHEMA_CONTEXT_REVIEW: JsonSchemaSpec = {
  name: 'context_file_review',
  schema: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            workspaceId: { type: 'string' },
            overallScore: { type: 'number' },
            categoryScores: { type: 'object', additionalProperties: { type: 'number' } },
            findings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  severity: { type: 'string', enum: ['good', 'warning', 'critical'] },
                  file: { type: 'string' },
                  finding: { type: 'string' },
                  suggestion: { type: 'string' },
                },
                required: ['category', 'severity', 'file', 'finding', 'suggestion'],
                additionalProperties: false,
              },
            },
            missingFiles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  filename: { type: 'string' },
                  reason: { type: 'string' },
                  impact: { type: 'string', enum: ['high', 'medium', 'low'] },
                },
                required: ['filename', 'reason', 'impact'],
                additionalProperties: false,
              },
            },
            summary: { type: 'string' },
          },
          required: ['workspaceId', 'overallScore', 'categoryScores', 'findings', 'missingFiles', 'summary'],
          additionalProperties: false,
        },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },
};

function parseLlmJson<T>(text: string): T {
  let cleaned = text.trim();

  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  cleaned = cleaned.replaceAll(/^```(?:json|jsonc|jsonl)?\s*/gm, '').replaceAll(/```\s*$/gm, '').trim();

  // Strip single-line JS comments that LLMs sometimes insert
  cleaned = cleaned.replaceAll(/^\s*\/\/[^\n]*$/gm, '');

  // Handle JSONL: if the text has multiple top-level JSON objects on separate lines, wrap in array
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 1 && lines.every(l => l.startsWith('{') && l.endsWith('}'))) {
    const jsonlArray = '[' + lines.join(',') + ']';
    try { return JSON.parse(jsonlArray) as T; } catch { /* fall through */ }
  }

  // Locate the outermost JSON boundary
  const arrStart = cleaned.indexOf('[');
  const objStart = cleaned.indexOf('{');
  if (arrStart === -1 && objStart === -1) throw new Error('No JSON structure found in LLM response');

  let start: number;
  if (arrStart === -1) start = objStart;
  else if (objStart === -1) start = arrStart;
  else start = Math.min(arrStart, objStart);

  const openChar = cleaned[start];
  const closeChar = openChar === '[' ? ']' : '}';
  const end = cleaned.lastIndexOf(closeChar);
  if (end <= start) throw new Error('Malformed JSON structure in LLM response');

  cleaned = cleaned.slice(start, end + 1);

  // Attempt 1: direct parse
  try { return JSON.parse(cleaned) as T; } catch { /* fall through */ }

  // Attempt 2: fix common LLM quirks
  let fixed = cleaned;
  // Remove trailing commas before closing brackets/braces
  fixed = fixed.replaceAll(/,\s*([}\]])/g, '$1');
  // Replace smart/curly quotes with straight ones
  fixed = fixed.replaceAll(/[\u201C\u201D\u2033]/g, '"').replaceAll(/[\u2018\u2019\u2032]/g, "'");
  // Fix single-quoted strings to double-quoted (simple heuristic for keys/values)
  fixed = fixed.replaceAll(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
  // Remove control characters except \n \r \t
  // eslint-disable-next-line no-control-regex
  fixed = fixed.replaceAll(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

  try { return JSON.parse(fixed) as T; } catch { /* fall through */ }

  // Attempt 3: balance unmatched brackets
  const opens = (fixed.match(/[{[]/g) || []).length;
  const closes = (fixed.match(/[}\]]/g) || []).length;
  for (let i = 0; i < opens - closes; i++) {
    const lastOpen = Math.max(fixed.lastIndexOf('{'), fixed.lastIndexOf('['));
    fixed += fixed[lastOpen] === '{' ? '}' : ']';
  }

  try { return JSON.parse(fixed) as T; } catch { /* fall through */ }

  // Attempt 4: truncate to last complete object in an array
  const lastCompleteA = fixed.lastIndexOf('}]');
  const lastCompleteB = fixed.lastIndexOf('},');
  const lastComplete = Math.max(lastCompleteA, lastCompleteB);
  if (lastComplete > 0) {
    const truncated = fixed.slice(0, lastComplete + 1) + ']';
    try { return JSON.parse(truncated) as T; } catch { /* fall through */ }
  }

  throw new Error('Failed to parse JSON from LLM response');
}

const LLM_MAX_RETRIES = 2;
/** Hard cap for a single LLM request (ms). */
const LLM_REQUEST_TIMEOUT_MS = 90_000;

/** Race a promise against a timeout. Rejects with a clear message on timeout. */
function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`)), ms);
    p.then(v => { clearTimeout(t); resolve(v); }, e => {
      clearTimeout(t);
      reject(e instanceof Error ? e : new Error(String(e)));
    });
  });
}

function getClient(): AiSdkClient {
  const cfg = vscode.workspace.getConfiguration('aiEngineerCoach.llm');
  const apiKey = cfg.get<string>('apiKey', '');
  const baseUrl = cfg.get<string>('baseUrl', '');
  if (!apiKey || !baseUrl) {
    throw new Error(
      'AI service not configured. Set aiEngineerCoach.llm.apiKey and aiEngineerCoach.llm.baseUrl in VS Code settings.'
    );
  }
  return new AiSdkClient({ apiKey, baseUrl, retry: { maxAttempts: 3, initialDelayMs: 200, backoffFactor: 2 } });
}

function getModel(): string {
  return vscode.workspace.getConfiguration('aiEngineerCoach.llm').get<string>('model', 'gpt-5.1');
}

function getProvider(): string {
  return vscode.workspace.getConfiguration('aiEngineerCoach.llm').get<string>('provider', 'openai');
}

/**
 * Translate a message array into SDK `{ instructions, prompt }` params.
 *
 * Callers use the convention [User(system), User(content)], matching the old
 * VS Code LM API pattern where a separate system role didn't exist.
 * Multi-turn arrays (retry loops) are flattened into a single prompt.
 */
function toSdkParams(messages: LlmMessage[]): { instructions?: string; prompt: string } {
  if (messages.length === 1) return { prompt: messages[0].content };
  if (messages.length === 2) return { instructions: messages[0].content, prompt: messages[1].content };
  // Multi-turn (e.g. retry loop): flatten with role labels
  return { prompt: messages.map(m => `[${m.role.toUpperCase()}]\n${m.content}`).join('\n\n') };
}

async function createResponse(instructions: string | undefined, prompt: string): Promise<string> {
  const sdk = getClient();
  const model = getModel();
  const provider = getProvider();

  const params = { prompt, instructions, model, stream: true as const };

  const stream = provider === 'bedrock'
    ? sdk.responses.bedrock.create(params)
    : sdk.responses.openai.create(params);

  let text = '';
  for await (const event of stream) {
    if (event.type === 'text') text += event.value;
    if (event.type === 'error') throw new Error(event.value);
  }
  return text;
}

export async function callLlm(messages: LlmMessage[]): Promise<string> {
  const { instructions, prompt } = toSdkParams(messages);

  let lastError: unknown;
  for (let attempt = 0; attempt <= LLM_MAX_RETRIES; attempt++) {
    try {
      return await withTimeout(createResponse(instructions, prompt), LLM_REQUEST_TIMEOUT_MS, 'LLM request');
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export async function callLlmJson<T>(messages: LlmMessage[], jsonSchema?: JsonSchemaSpec): Promise<T> {
  const sdk = getClient();
  const model = getModel();
  const provider = getProvider();

  let lastError: unknown;
  let parseFailures = 0;
  const retryMessages = [...messages];

  for (let attempt = 0; attempt <= LLM_MAX_RETRIES; attempt++) {
    const { instructions: retryInstructions, prompt: retryPrompt } = toSdkParams(retryMessages);

    try {
      const base = { prompt: retryPrompt, instructions: retryInstructions, model, stream: false as const };
      const schemaSpec = jsonSchema
        ? { name: jsonSchema.name, description: jsonSchema.description ?? '', schema: jsonSchema.schema, strict: true }
        : undefined;
      const call = provider === 'bedrock'
        ? sdk.responses.bedrock.create(schemaSpec
            ? { ...base, responseFormat: BedrockResponseFormat.JSON_SCHEMA, responseFormatSchema: schemaSpec }
            : base)
        : sdk.responses.openai.create(schemaSpec
            ? { ...base, responseFormat: OpenAiResponseFormat.JSON_SCHEMA, responseFormatSchema: schemaSpec }
            : base);
      const response = await withTimeout(call, LLM_REQUEST_TIMEOUT_MS, 'LLM request');

      const text = (response.result ?? '').trim();
      try {
        return JSON.parse(text) as T;
      } catch {
        return parseLlmJson<T>(text);
      }
    } catch (err) {
      lastError = err;
      // On parse failures, nudge the model to return valid JSON on the next attempt
      if (lastError instanceof Error && /JSON|parse/i.test(lastError.message)) {
        parseFailures++;
        if (retryMessages.length === messages.length) {
          retryMessages.push({
            role: 'user',
            content: 'Your previous response was not valid JSON. Please respond ONLY with a valid JSON object or array, no markdown fences, no commentary.',
          });
        }
      }
    }
  }

  const label = parseFailures > 0
    ? `LLM returned invalid JSON after ${LLM_MAX_RETRIES + 1} attempts. Please try again.`
    : (lastError instanceof Error ? lastError.message : 'LLM request failed after retries');
  throw new Error(label);
}


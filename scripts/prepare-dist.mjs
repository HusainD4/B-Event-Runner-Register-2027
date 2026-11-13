import { cp, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const generated = path.join(root, 'src', 'generated', 'client');

async function exists(file) {
  try {
    return await stat(file);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function resolveSpecifier(file, specifier) {
  if (!specifier.startsWith('.')) return specifier;
  const target = path.resolve(path.dirname(file), specifier);
  if (await exists(target) && (await stat(target)).isFile()) return specifier;
  if (await exists(`${target}.js`)) return `${specifier}.js`;
  if (await exists(path.join(target, 'index.js'))) return `${specifier}/index.js`;
  throw new Error(`Cannot resolve ${specifier} in ${file}`);
}

async function rewriteImports(file) {
  const source = await readFile(file, 'utf8');
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const imports = [];
  function visit(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)) {
      imports.push(node.moduleSpecifier);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
               node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) {
      imports.push(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  let result = source;
  for (const node of imports.reverse()) {
    const resolved = await resolveSpecifier(file, node.text);
    if (resolved !== node.text) {
      result = result.slice(0, node.getStart(parsed)) + JSON.stringify(resolved) + result.slice(node.end);
    }
  }
  if (result !== source) await writeFile(file, result);
}

async function visitDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (file !== path.join(dist, 'generated')) await visitDirectory(file);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      await rewriteImports(file);
    }
  }
}

if (!(await exists(path.join(generated, 'index.js')))) {
  throw new Error('Prisma Client is missing. Run npx prisma generate on the deployment host before building.');
}
await cp(generated, path.join(dist, 'generated', 'client'), {
  recursive: true,
  filter: source => !/\.tmp\d+$/.test(source),
});
await visitDirectory(dist);

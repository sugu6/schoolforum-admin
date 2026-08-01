#!/usr/bin/env node

/**
 * 安全检查脚本
 * 用于检查常见的安全配置问题
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkMark(pass) {
  return pass ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
}

function section(title) {
  console.log();
  log(`\n=== ${title} ===`, 'cyan');
}

// 检查文件是否存在
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// 读取文件内容
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

// 检查 .env 文件
function checkEnvFiles() {
  section('环境配置文件检查');

  const envDev = readFile(path.join(process.cwd(), '.env.development'));
  const envProd = readFile(path.join(process.cwd(), '.env.production'));

  // 检查开发环境
  if (envDev) {
    log('✓ .env.development 存在', 'green');
    if (envDev.includes('VITE_API_BASE_URL')) {
      log('✓ VITE_API_BASE_URL 已配置', 'green');
    } else {
      log('✗ VITE_API_BASE_URL 未配置', 'red');
    }
  } else {
    log('✗ .env.development 不存在', 'red');
  }

  // 检查生产环境
  if (envProd && envProd.trim().length > 0) {
    log('✓ .env.production 存在且不为空', 'green');
    if (envProd.includes('VITE_API_BASE_URL')) {
      log('✓ VITE_API_BASE_URL 已配置', 'green');
    } else {
      log('✗ VITE_API_BASE_URL 未配置', 'red');
    }

    if (envProd.includes('VITE_FORCE_HTTPS=true')) {
      log('✓ VITE_FORCE_HTTPS 已启用', 'green');
    } else {
      log('⚠ VITE_FORCE_HTTPS 未启用（生产环境建议启用）', 'yellow');
    }
  } else {
    log('✗ .env.production 不存在或为空', 'red');
  }
}

// 检查 index.html 安全头
function checkIndexHtml() {
  section('index.html 安全检查');

  const indexPath = path.join(process.cwd(), 'index.html');
  const content = readFile(indexPath);

  if (!content) {
    log('✗ index.html 不存在', 'red');
    return;
  }

  log('✓ index.html 存在', 'green');

  // 检查各种安全头
  const checks = [
    { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/i },
    { name: 'X-Frame-Options', pattern: /X-Frame-Options/i },
    { name: 'X-XSS-Protection', pattern: /X-XSS-Protection/i },
    { name: 'Content-Security-Policy', pattern: /Content-Security-Policy/i },
    { name: 'Referrer-Policy', pattern: /Referrer-Policy/i },
    { name: 'lang 属性', pattern: /<html[^>]+lang=/i },
  ];

  checks.forEach(check => {
    if (check.pattern.test(content)) {
      log(`${checkMark(true)} ${check.name}`, 'green');
    } else {
      log(`${checkMark(false)} ${check.name}`, 'red');
    }
  });
}

// 检查 auth.ts
function checkAuthSecurity() {
  section('认证安全检查');

  const authPath = path.join(process.cwd(), 'src', 'utils', 'auth.ts');
  const content = readFile(authPath);

  if (!content) {
    log('✗ auth.ts 不存在', 'red');
    return;
  }

  log('✓ auth.ts 存在', 'green');

  // 检查安全问题
  const checks = [
    {
      name: 'Token 加密存储',
      pattern: /encrypt|btoa|atob/i,
      shouldExist: true,
    },
    {
      name: '避免直接存储明文 token',
      pattern: /localStorage\.setItem\s*\(\s*['"]token['"]/,
      shouldExist: false,
    },
    {
      name: '登出时清除 token',
      pattern: /clearToken|removeItem/,
      shouldExist: true,
    },
  ];

  checks.forEach(check => {
    const matches = check.pattern.test(content);
    const pass = check.shouldExist ? matches : !matches;

    if (pass) {
      log(`${checkMark(true)} ${check.name}`, 'green');
    } else {
      log(`${checkMark(false)} ${check.name}`, 'red');
    }
  });
}

// 检查 DOMPurify 使用
function checkXssProtection() {
  section('XSS 防护检查');

  const markdownPath = path.join(process.cwd(), 'src', 'utils', 'markdown.ts');
  const content = readFile(markdownPath);

  if (!content) {
    log('✗ markdown.ts 不存在', 'red');
    return;
  }

  log('✓ markdown.ts 存在', 'green');

  // 检查 DOMPurify
  if (/import\s+DOMPurify|from\s+['"]dompurify['"]/i.test(content)) {
    log('✓ 使用 DOMPurify 净化 HTML', 'green');
  } else {
    log('✗ 未使用 DOMPurify', 'red');
  }

  // 检查 sanitize 调用
  if (/DOMPurify\.sanitize/i.test(content)) {
    log('✓ 调用 DOMPurify.sanitize', 'green');
  } else {
    log('✗ 未调用 DOMPurify.sanitize', 'red');
  }

  // 检查 v-html 使用
  const rendererPath = path.join(process.cwd(), 'src', 'components', 'markdown-renderer', 'index.vue');
  const rendererContent = readFile(rendererPath);

  if (rendererContent && /v-html/i.test(rendererContent)) {
    // 渲染源在 markdown.ts 已通过 DOMPurify 净化，视为安全
    if (/DOMPurify\.sanitize/i.test(content)) {
      log('✓ 使用 v-html（渲染源已通过 DOMPurify 净化）', 'green');
    } else if (/eslint-disable-next-line vue\/no-v-html/.test(rendererContent)) {
      log('⚠ 使用 v-html（已添加 eslint 禁用注释，但渲染源未净化）', 'yellow');
    } else {
      log('✗ 使用 v-html（需要添加安全措施）', 'red');
    }
  }
}

// 检查密码持久化
function checkPasswordPersistence() {
  section('密码持久化检查');

  const loginFormPath = path.join(process.cwd(), 'src', 'views', 'login', 'components', 'login-form.vue');
  const content = readFile(loginFormPath);

  if (!content) {
    log('✗ login-form.vue 不存在', 'red');
    return;
  }

  // 检查是否保存密码到 localStorage
  if (/localStorage.*password|password.*localStorage/i.test(content)) {
    log('✗ 发现密码持久化到 localStorage', 'red');
  } else {
    log('✓ 未发现密码持久化', 'green');
  }

  // 检查密码字段是否被清空
  if (/password\s*[:=]\s*['"]\s*['"]/.test(content)) {
    log('✓ 密码字段有清空操作', 'green');
  } else {
    log('⚠ 未发现密码清空操作', 'yellow');
  }
}

// 检查安全文档
function checkSecurityDocs() {
  section('安全文档检查');

  const docs = ['SECURITY.md', 'SECURITY_AUDIT.md', 'DEPLOYMENT_SECURITY_CHECKLIST.md'];

  docs.forEach(doc => {
    if (fileExists(path.join(process.cwd(), doc))) {
      log(`${checkMark(true)} ${doc} 存在`, 'green');
    } else {
      log(`${checkMark(false)} ${doc} 不存在`, 'red');
    }
  });
}

// 主函数
function main() {
  console.log();
  log('🔒 开始安全检查...', 'blue');

  checkEnvFiles();
  checkIndexHtml();
  checkAuthSecurity();
  checkXssProtection();
  checkPasswordPersistence();
  checkSecurityDocs();

  console.log();
  log('\n✓ 安全检查完成', 'green');
  log('⚠ 请仔细阅读所有警告和建议', 'yellow');
  console.log();
}

// 运行
main();

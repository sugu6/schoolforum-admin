export const meta = {
  name: 'comprehensive-code-review-simplification',
  description: '多维度代码审查和代码简化：安全性、性能、质量、TypeScript、Vue最佳实践',
  phases: [
    { title: '代码审查', detail: '5个并行代理从不同维度审查代码' },
    { title: '代码简化', detail: '基于审查结果进行代码简化和优化' },
    { title: '验证修复', detail: '验证所有修复的正确性' }
  ]
}

// 阶段1：代码审查
phase('代码审查')

const reviewDimensions = [
  {
    key: 'security',
    label: 'security-review',
    prompt: `你是安全审查专家。审查 src/ 目录下的所有 Vue 和 TypeScript 代码，重点关注：
1. XSS 漏洞（v-html 使用、未转义的用户输入）
2. 敏感数据泄露（console.log、错误信息暴露）
3. 不安全的 API 调用（缺少 HTTPS、token 存储）
4. 权限绕过风险（前端权限检查缺失）
5. 依赖安全（已知的恶意包）

重点关注：
- src/api/interceptor.ts（token 处理）
- src/utils/auth.ts（认证逻辑）
- src/views/login/（登录逻辑）
- 所有使用 v-html 的组件
- 所有 API 调用点

返回格式：
{
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "安全类别",
      "file": "文件路径",
      "line": 行号,
      "description": "问题描述",
      "impact": "潜在影响",
      "recommendation": "修复建议"
    }
  ],
  "summary": "整体安全状况总结"
}`
  },
  {
    key: 'performance',
    label: 'performance-review',
    prompt: `你是性能优化专家。审查 src/ 目录下的所有 Vue 和 TypeScript 代码，重点关注：
1. 不必要的重渲染（缺少 key、滥用 computed/watch）
2. 大型列表渲染（缺少虚拟滚动、分页）
3. 内存泄漏风险（未清理的事件监听器、定时器）
4. 过度的 API 请求（缺少防抖节流、缓存）
5. 大型 bundle 风险（未 tree-shaking、重复导入）
6. 图片和资源优化

重点关注：
- src/views/ 中的列表页面
- src/components/ 中的可复用组件
- src/hooks/ 中的组合式函数
- src/api/ 中的 API 调用

返回格式：
{
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "性能类别",
      "file": "文件路径",
      "line": 行号,
      "description": "问题描述",
      "impact": "性能影响",
      "recommendation": "优化建议"
    }
  ],
  "summary": "整体性能状况总结"
}`
  },
  {
    key: 'code-quality',
    label: 'quality-review',
    prompt: `你是代码质量专家。审查 src/ 目录下的所有 Vue 和 TypeScript 代码，重点关注：
1. 代码重复（Copy-Paste 代码、重复逻辑）
2. 过长函数（超过 50 行的函数）
3. 复杂度过高（深度嵌套、多重条件）
4. 命名不规范（ unclear naming、 magic numbers）
5. 注释不足或过度注释
6. 错误处理不当（空的 catch、 swallowed errors）
7. 硬编码值（URL、配置、magic numbers）

重点关注：
- src/api/（API 调用模式）
- src/views/management/（业务逻辑）
- src/hooks/（复用逻辑）
- src/components/（组件结构）

返回格式：
{
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "质量类别",
      "file": "文件路径",
      "line": 行号,
      "description": "问题描述",
      "impact": "维护影响",
      "recommendation": "改进建议"
    }
  ],
  "summary": "整体代码质量总结"
}`
  },
  {
    key: 'typescript',
    label: 'typescript-review',
    prompt: `你是 TypeScript 专家。审查 src/ 目录下的所有 TypeScript 代码，重点关注：
1. 类型滥用 any（应该使用具体类型或 unknown）
2. 类型断言过度使用（as 类型、! 非空断言）
3. 缺失的类型定义（接口、类型、返回值）
4. 类型不一致（相同数据不同类型定义）
5. 未使用的类型定义
6. 类型守卫缺失（运行时类型检查）
7. 泛型使用不当

重点关注：
- src/api/ 中的所有 API 响应类型
- src/types/ 中的类型定义
- src/store/ 中的状态类型
- src/hooks/ 中的组合式函数类型

返回格式：
{
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "TypeScript 类别",
      "file": "文件路径",
      "line": 行号,
      "description": "问题描述",
      "impact": "类型安全影响",
      "recommendation": "修复建议"
    }
  ],
  "summary": "整体 TypeScript 质量总结"
}`
  },
  {
    key: 'vue-patterns',
    label: 'vue-patterns-review',
    prompt: `你是 Vue 3 专家。审查 src/ 目录下的所有 Vue 组件，重点关注：
1. Composition API 最佳实践（setup 语法、ref/reactive 使用）
2. 响应式数据滥用（不必要的 ref/reactive）
3. 生命周期钩子使用不当（onMounted/onUnmounted 缺失清理）
4. Props/Emits 类型定义缺失
5. 组件通信反模式（过度使用 provide/inject、事件总线）
6. 模板复杂度过高（过度嵌套、复杂表达式）
7. 指令使用不当（v-if/v-show 滥用、key 缺失）
8. Pinia 状态管理反模式（过度使用全局状态）

重点关注：
- src/views/ 中的所有页面组件
- src/components/ 中的所有组件
- src/layout/ 中的布局组件

返回格式：
{
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "Vue 最佳实践类别",
      "file": "文件路径",
      "line": 行号,
      "description": "问题描述",
      "impact": "可维护性影响",
      "recommendation": "改进建议"
    }
  ],
  "summary": "整体 Vue 代码质量总结"
}`
  }
]

// 并行运行所有审查代理
const reviewResults = await parallel(
  reviewDimensions.map(dim => () =>
    agent(`代码审查 - ${dim.key}`, {
      label: dim.label,
      phase: '代码审查',
      prompt: dim.prompt,
      schema: {
        type: 'object',
        properties: {
          findings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
                category: { type: 'string' },
                file: { type: 'string' },
                line: { type: 'number' },
                description: { type: 'string' },
                impact: { type: 'string' },
                recommendation: { type: 'string' }
              },
              required: ['severity', 'category', 'file', 'description', 'recommendation']
            }
          },
          summary: { type: 'string' }
        },
        required: ['findings', 'summary']
      }
    })
  )
)

// 汇总审查结果
log(`✓ 代码审查完成：发现 ${reviewResults.filter(Boolean).flatMap(r => r?.findings || []).length} 个问题`)

// 阶段2：代码简化
phase('代码简化')

// 统计所有 critical 和 high 级别的问题
const criticalHighIssues = reviewResults
  .filter(Boolean)
  .flatMap(r => r?.findings || [])
  .filter(f => f.severity === 'critical' || f.severity === 'high')

log(`开始处理 ${criticalHighIssues.length} 个高优先级问题...`)

// 创建简化计划
const simplificationPlan = {
  security: criticalHighIssues.filter(f => f.severity === 'critical'),
  performance: criticalHighIssues.filter(f => f.category.includes('性能')),
  duplication: criticalHighIssues.filter(f => f.category.includes('重复') || f.category.includes('重复')),
  typescript: criticalHighIssues.filter(f => f.category.includes('TypeScript')),
  vuePatterns: criticalHighIssues.filter(f => f.category.includes('Vue'))
}

// 并行执行简化任务
const simplificationTasks = []

// 任务1：修复安全问题
if (simplificationPlan.security.length > 0) {
  simplificationTasks.push(
    () => agent('修复安全问题', {
      label: 'fix-security',
      phase: '代码简化',
      prompt: `基于以下安全问题列表，读取相关文件并修复所有 critical 级别的安全问题：

${JSON.stringify(simplificationPlan.security, null, 2)}

要求：
1. 使用 Read 工具读取每个问题涉及的文件
2. 使用 Edit 工具修复每个问题
3. 修复后简要说明每个问题的修复方案
4. 优先修复 critical 级别问题

返回格式：
{
  "fixed": [{"file": "路径", "issue": "问题描述", "fix": "修复说明"}],
  "remaining": [{"file": "路径", "issue": "问题描述", "reason": "未修复原因"}]
}`
    })
  )
}

// 任务2：优化重复代码
const duplicationIssues = criticalHighIssues.filter(f =>
  f.category.includes('重复') || f.category.includes('Code Duplication')
)
if (duplicationIssues.length > 0) {
  simplificationTasks.push(
    () => agent('消除代码重复', {
      label: 'deduplicate-code',
      phase: '代码简化',
      prompt: `基于以下代码重复问题，分析并消除重复代码：

${JSON.stringify(duplicationIssues, null, 2)}

要求：
1. 读取所有涉及的文件
2. 识别重复的代码块
3. 提取公共函数、mixin 或 composable
4. 使用 Edit 工具重构代码
5. 确保重构后功能不变

重点关注：
- src/api/ 中的重复 API 调用模式
- src/views/ 中的重复表格/表单逻辑
- src/hooks/ 中的重复逻辑

返回格式：
{
  "extracted": [{"utility": "工具函数名", "location": "存放位置", "usage": "使用场景"}],
  "refactored": [{"file": "文件", "changes": "变更说明"}]
}`
    })
  )
}

// 任务3：优化 TypeScript 类型
const tsIssues = criticalHighIssues.filter(f => f.category.includes('TypeScript'))
if (tsIssues.length > 0) {
  simplificationTasks.push(
    () => agent('优化 TypeScript 类型', {
      label: 'improve-types',
      phase: '代码简化',
      prompt: `基于以下 TypeScript 问题，改进类型定义：

${JSON.stringify(tsIssues, null, 2)}

要求：
1. 读取相关文件和类型定义
2. 消除不必要的 any 类型
3. 添加缺失的类型定义
4. 统一不一致的类型
5. 使用 Edit 工具应用改进

重点关注：
- src/types/ 中的全局类型
- src/api/ 中的 API 响应类型
- src/store/ 中的状态类型

返回格式：
{
  "improved": [{"file": "文件", "type": "类型名", "change": "变更说明"}],
  "added": [{"file": "文件", "type": "新增类型", "purpose": "用途"}]
}`
    })
  )
}

// 任务4：优化 Vue 组件
const vueIssues = criticalHighIssues.filter(f => f.category.includes('Vue'))
if (vueIssues.length > 0) {
  simplificationTasks.push(
    () => agent('优化 Vue 组件', {
      label: 'optimize-vue',
      phase: '代码简化',
      prompt: `基于以下 Vue 最佳实践问题，优化组件代码：

${JSON.stringify(vueIssues, null, 2)}

要求：
1. 读取相关 Vue 组件
2. 优化 Composition API 使用
3. 改进响应式数据管理
4. 简化模板复杂度
5. 使用 Edit 工具应用优化

重点关注：
- 响应式数据滥用（过度使用 ref/reactive）
- 生命周期钩子使用不当
- Props/Emits 类型定义缺失
- 模板复杂度过高

返回格式：
{
  "optimized": [{"file": "组件路径", "aspect": "优化方面", "change": "变更说明"}]
}`
    })
  )
}

// 执行所有简化任务
const simplificationResults = await parallel(simplificationTasks)

log(`✓ 代码简化完成：${simplificationResults.filter(Boolean).length} 个任务执行成功`)

// 阶段3：验证修复
phase('验证修复')

// 收集所有修改的文件
const modifiedFiles = new Set()
simplificationResults.filter(Boolean).forEach(result => {
  // 处理安全问题
  if (result.fixed && Array.isArray(result.fixed)) {
    result.fixed.forEach(f => {
      if (f.file) modifiedFiles.add(f.file)
    })
  }
  // 处理重复代码
  if (result.refactored && Array.isArray(result.refactored)) {
    result.refactored.forEach(f => {
      if (f.file) modifiedFiles.add(f.file)
    })
  }
  // 处理 TypeScript 类型
  if (result.improved && Array.isArray(result.improved)) {
    result.improved.forEach(f => {
      if (f.file) modifiedFiles.add(f.file)
    })
  }
  // 处理 Vue 组件
  if (result.optimized && Array.isArray(result.optimized)) {
    result.optimized.forEach(f => {
      if (f.file) modifiedFiles.add(f.file)
    })
  }
  // 兼容其他可能的格式
  if (result.files && Array.isArray(result.files)) {
    result.files.forEach(f => modifiedFiles.add(f))
  }
  if (result.modified && Array.isArray(result.modified)) {
    result.modified.forEach(f => modifiedFiles.add(f))
  }
})

log(`验证 ${modifiedFiles.size} 个修改的文件...`)

// 并行验证修改的文件
const verificationPromises = Array.from(modifiedFiles).slice(0, 10).map(file =>
  () => agent(`验证文件: ${file}`, {
    label: `verify-${file.replace(/\//g, '-')}`,
    phase: '验证修复',
    prompt: `读取文件 ${file}，验证：
1. 代码语法是否正确
2. 类型定义是否完整
3. 是否有新的明显问题引入
4. 是否符合 Vue 3 和 TypeScript 最佳实践

如果发现问题，列出具体问题。如果没有问题，确认修复正确。

返回格式：
{
  "status": "passed|failed",
  "issues": ["问题列表"],
  "suggestions": ["改进建议"]
}`
  })
)

const verificationResults = await parallel(verificationPromises)

const passed = verificationResults.filter(r => r?.status === 'passed').length
const failed = verificationResults.filter(r => r?.status === 'failed').length

log(`✓ 验证完成：${passed} 通过，${failed} 需要关注`)

// 最终报告
const allFindings = reviewResults.filter(Boolean).flatMap(r => r?.findings || [])
const criticalCount = allFindings.filter(f => f.severity === 'critical').length
const highCount = allFindings.filter(f => f.severity === 'high').length
const mediumCount = allFindings.filter(f => f.severity === 'medium').length
const lowCount = allFindings.filter(f => f.severity === 'low').length

return {
  review: {
    total: allFindings.length,
    critical: criticalCount,
    high: highCount,
    medium: mediumCount,
    low: lowCount,
    dimensions: reviewResults.filter(Boolean).map(r => ({
      key: r.key,
      summary: r.summary,
      count: r.findings.length
    }))
  },
  simplification: {
    tasksCompleted: simplificationResults.filter(Boolean).length,
    filesModified: modifiedFiles.size
  },
  verification: {
    checked: verificationResults.length,
    passed,
    failed
  },
  summary: `代码审查和简化完成！
- 审查发现 ${allFindings.length} 个问题（Critical: ${criticalCount}, High: ${highCount}, Medium: ${mediumCount}, Low: ${lowCount}）
- 完成 ${simplificationResults.filter(Boolean).length} 个简化任务
- 修改了 ${modifiedFiles.size} 个文件
- 验证 ${passed} 个文件通过，${failed} 个需要关注
- 建议优先处理 ${criticalCount + highCount} 个高优先级问题`
}

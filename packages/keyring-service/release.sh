#!/usr/bin/env bash
set -euo pipefail

# =============================
# UniSat Monorepo Release Script
# =============================

BUMP_TYPE=${1:-""}   # 读取第一个参数：patch/minor/major

if [ -z "$BUMP_TYPE" ]; then
  echo "❌ Please specify bump type: patch | minor | major"
  exit 1
fi

if [[ "$BUMP_TYPE" != "patch" && "$BUMP_TYPE" != "minor" && "$BUMP_TYPE" != "major" ]]; then
  echo "❌ Invalid bump type: $BUMP_TYPE"
  echo "👉 Use: patch | minor | major"
  exit 1
fi

echo "🚀 UniSat Monorepo Release Started ($BUMP_TYPE)"

# 1. 安装依赖
echo "📦 Installing dependencies..."
pnpm install

# 2. 自动创建 changeset
echo "📝 Creating changeset..."
pnpm changeset add --empty --summary "chore: $BUMP_TYPE release"
# ↑ 用 --empty 创建一个空 changeset（不会问交互）
#   然后我们替换 bump 类型

# 修改 .changeset 里的 bump 类型
LATEST_FILE=$(ls -t .changeset/*.md | head -n1)
sed -i '' "s/---/---\n\"@unisat\/keyring-service\": $BUMP_TYPE\n/" "$LATEST_FILE"
# 如果有多个包，可以手动补上其它包

# 3. 更新版本号 & 替换 workspace:*
echo "🔖 Updating versions..."
pnpm changeset version

# 4. 安装更新后的依赖
pnpm install

# 5. 构建所有包
echo "🛠️  Building packages..."
pnpm build

# 6. 发布到 npm
echo "📤 Publishing to npm..."
pnpm changeset publish

# 7. 提交并推送 git
echo "🔗 Committing release..."
git add -A
git commit -m "chore: release ($BUMP_TYPE)"
git push origin main --follow-tags

echo "✅ Release completed!"

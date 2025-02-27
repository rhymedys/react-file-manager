# 步骤零：安装依赖
pnpm install

# 步骤一：自动修改 package.json 的 version 版本号自动加1
$packageJsonPath = "package.json"
$packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
$versionParts = $packageJson.version -split '\.'
$versionParts[2] = [int]$versionParts[2] + 1
$newVersion = $versionParts -join '.'
$packageJson.version = $newVersion
$packageJson | ConvertTo-Json | Set-Content $packageJsonPath

# 步骤二：npm run build
npm run build

# 步骤三：nrm use npm
nrm use npm

# 步骤四：npm publish
npm publish
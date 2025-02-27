import fs from 'fs';
import { execSync } from 'child_process';

// 步骤零：安装依赖
execSync('pnpm install', { stdio: 'inherit' });

// 步骤一：自动修改 package.json 的 version 版本号自动加1
const packageJsonPath = './package.json';
const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath, 'utf8'));
const versionParts = packageJson.version.split('.');
versionParts[2] = parseInt(versionParts[2], 10) + 1;
const newVersion = versionParts.join('.');
packageJson.version = newVersion;
await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

// 步骤二：npm run build
execSync('npm run build', { stdio: 'inherit' });

// 步骤三：nrm use npm
execSync('nrm use npm', { stdio: 'inherit' });

// 步骤四：npm publish
execSync('npm publish', { stdio: 'inherit' });
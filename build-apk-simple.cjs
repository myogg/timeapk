#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建APK...');

try {
  // 1. 构建Vite项目
  console.log('1. 构建Web应用...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. 初始化Cordova项目（如果不存在）
  if (!fs.existsSync('cordova')) {
    console.log('2. 初始化Cordova项目...');
    execSync('cordova create cordova com.nocode.workrecord "智能工作记录系统"', { stdio: 'inherit' });
  }
  
  // 3. 复制构建文件到Cordova项目
  console.log('3. 复制文件到Cordova项目...');
  const cordovaWWW = path.join('cordova', 'www');
  
  // 清空Cordova www目录
  if (fs.existsSync(cordovaWWW)) {
    fs.rmSync(cordovaWWW, { recursive: true, force: true });
  }
  
  // 复制构建文件
  fs.cpSync('build', cordovaWWW, { recursive: true });
  
  // 复制配置文件
  fs.copyFileSync('config.xml', path.join('cordova', 'config.xml'));
  
  // 4. 添加Android平台
  console.log('4. 添加Android平台...');
  process.chdir('cordova');
  
  try {
    execSync('cordova platform add android', { stdio: 'inherit' });
  } catch (error) {
    console.log('Android平台可能已存在，继续...');
  }
  
  // 5. 构建APK
  console.log('5. 构建APK...');
  execSync('cordova build android --release', { stdio: 'inherit' });
  
  console.log('✅ APK构建完成！');
  console.log('APK位置: cordova/platforms/android/app/build/outputs/apk/release/');
  
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

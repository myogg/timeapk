#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始打包APK...');

try {
  // 1. 构建React项目
  console.log('1️⃣ 构建React项目...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. 初始化Cordova项目（如果不存在）
  if (!fs.existsSync('cordova')) {
    console.log('2️⃣ 初始化Cordova项目...');
    execSync('cordova create cordova com.nocode.workrecord "智能工作记录系统"', { stdio: 'inherit' });
  }
  
  // 3. 复制构建文件到Cordova项目
  console.log('3️⃣ 复制文件到Cordova项目...');
  const cordovaWWW = path.join('cordova', 'www');
  
  // 清空Cordova www目录
  if (fs.existsSync(cordovaWWW)) {
    fs.rmSync(cordovaWWW, { recursive: true, force: true });
  }
  
  // 复制构建文件
  fs.cpSync('dist', cordovaWWW, { recursive: true });
  
  // 复制配置文件
  fs.copyFileSync('config.xml', path.join('cordova', 'config.xml'));
  
  // 4. 添加Android平台
  console.log('4️⃣ 添加Android平台...');
  process.chdir('cordova');
  
  try {
    execSync('cordova platform add android', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Android平台可能已存在，继续...');
  }
  
  // 5. 构建APK
  console.log('5️⃣ 构建APK...');
  execSync('cordova build android --release', { stdio: 'inherit' });
  
  console.log('✅ APK打包完成！');
  console.log('📱 APK位置: cordova/platforms/android/app/build/outputs/apk/release/');
  console.log('📁 文件名: app-release-unsigned.apk');
  
} catch (error) {
  console.error('❌ 打包失败:', error.message);
  process.exit(1);
}

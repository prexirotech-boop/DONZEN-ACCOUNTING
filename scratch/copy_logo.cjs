const fs = require('fs');

const srcPath = 'C:\\Users\\Admin\\Downloads\\DONZEN SALES WEB FILES\\Donzen_Media_-_2022-01-26T180513.030-removebg-preview.png';
const destLogo = 'c:\\Users\\Admin\\Downloads\\DONZEN SALES\\public\\logo.png';
const destDonzenLogo = 'c:\\Users\\Admin\\Downloads\\DONZEN SALES\\public\\donzen-logo.png';

if (fs.existsSync(srcPath)) {
  fs.copyFileSync(srcPath, destLogo);
  fs.copyFileSync(srcPath, destDonzenLogo);
  console.log('✅ Donzen_Media copied successfully to both locations.');
} else {
  console.log('Error: Source file does not exist:', srcPath);
}

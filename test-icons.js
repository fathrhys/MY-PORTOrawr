const si = require("react-icons/si");
const fa = require("react-icons/fa");

const test = [
  "SiAmazonwebservices", "SiDocker", "SiLinux", "SiCloudflare", 
  "SiKalilinux", "SiWireshark", "SiOwasp", "SiPython", "SiGnubash", 
  "SiTypescript", "SiNextdotjs", "FaBug", "FaDatabase", "FaShieldAlt"
];

for(const icon of test) {
  if (icon.startsWith("Si")) {
     if (!si[icon]) console.log("Missing:", icon);
  } else {
     if (!fa[icon]) console.log("Missing:", icon);
  }
}
console.log("Done checking icons.");

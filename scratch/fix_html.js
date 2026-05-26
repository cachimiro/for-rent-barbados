const fs = require('fs');
const path = require('path');
function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html')) {
      let c = fs.readFileSync(p, 'utf8');
      let nc = c.replace(/<script id="mphb-js" src="[^"]*mphb\.min\.js"><\/script>/g, '');
      nc = nc.replace(/class="([^"]*)mphb-datepick([^"]*)"/g, 'class="$1$2"');
      nc = nc.replace(/<input([^>]*?)type="text"([^>]*?)(name="mphb_check_(in|out)_date")/g, '<input$1type="date"$2$3');
      if (c !== nc) {
        fs.writeFileSync(p, nc);
        console.log(`Fixed ${p}`);
      }
    }
  });
}
walk('./web-old/src');
console.log('Done');

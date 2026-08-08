import re

file_path = r"c:\Users\yunush alam\OneDrive\Desktop\springboot project\src\main\resources\static\index.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract styles
style_pattern = re.compile(r'<style>(.*?)</style>', re.DOTALL)
styles = style_pattern.findall(content)
combined_css = "\n".join(styles)

# Extract scripts
script_pattern = re.compile(r'<script>(.*?)</script>', re.DOTALL)
scripts = script_pattern.findall(content)
combined_js = "\n".join(scripts)

# Remove styles and scripts from html
new_html = re.sub(r'<style>.*?</style>', '<link rel="stylesheet" href="styles.css">', content, flags=re.DOTALL)
new_html = re.sub(r'<script>.*?</script>', '<script src="app.js"></script>', new_html, flags=re.DOTALL)

with open(r"c:\Users\yunush alam\OneDrive\Desktop\springboot project\src\main\resources\static\styles.css", "w", encoding="utf-8") as f:
    f.write(combined_css)

with open(r"c:\Users\yunush alam\OneDrive\Desktop\springboot project\src\main\resources\static\app.js", "w", encoding="utf-8") as f:
    f.write(combined_js)

with open(r"c:\Users\yunush alam\OneDrive\Desktop\springboot project\src\main\resources\static\index.html", "w", encoding="utf-8") as f:
    f.write(new_html)

print("Extraction successful!")

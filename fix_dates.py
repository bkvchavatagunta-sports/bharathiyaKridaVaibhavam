import os
import re

files_to_fix = [
    "app/admin/gallery/GalleryGridAdmin.tsx",
    "app/admin/events/page.tsx",
    "app/admin/page.tsx",
    "app/(public)/pass/[id]/page.tsx",
    "app/(public)/events/page.tsx",
    "app/(public)/events/[slug]/page.tsx",
    "app/(public)/page.tsx"
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()

    # Add import if needed
    if 'import { format } from "date-fns"' not in content and 'import { format } from \'date-fns\'' not in content:
        # Find the last import line
        imports = re.findall(r'^import .*;', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + '\nimport { format } from "date-fns";')
        else:
            content = 'import { format } from "date-fns";\n' + content

    # Replace toLocaleDateString()
    # Case 1: event.startDate.toLocaleDateString()
    # Case 2: reg.registeredAt.toLocaleDateString()
    # Case 3: new Date(img.uploadedAt).toLocaleDateString()
    content = re.sub(r'([a-zA-Z0-9_.]+)\.toLocaleDateString\(\)', r"format(\1, 'dd/MM/yyyy')", content)
    # The new Date(...) case
    content = re.sub(r'new Date\(([^)]+)\)\.toLocaleDateString\(\)', r"format(new Date(\1), 'dd/MM/yyyy')", content)
    # Wait, the first regex will catch `new Date(img.uploadedAt).toLocaleDateString` as `)`. Let's be careful.
    
    with open(filepath, 'w') as f:
        f.write(content)

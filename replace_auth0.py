import os
import re

# List of files that use Auth0
files_to_update = [
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\Navbar.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\blogs\Medblog.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\blogs\EditBlog.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\blogs\BlogDetail.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\components\blogs\BlogDashboard.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\AnxietyHistory.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\AnxietyPrediction.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\DepressionHistory.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\ImprovedBMIPrediction.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\SleepDisorder.jsx',
    r'c:\Users\Gaurang srivastava\Documents\MedLytics\medlytics\src\pages\SleepHistory.jsx',
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace Auth0 import with custom auth import
    content = re.sub(
        r"import \{ useAuth0 \} from '@auth0/auth0-react';",
        "import { useAuth } from '../contexts/useAuth';",
        content
    )
    
    # Handle special case for pages (different path)
    if '\\pages\\' in filepath:
        content = re.sub(
            r"import \{ useAuth \} from '\.\./contexts/useAuth';",
            "import { useAuth } from '../contexts/useAuth';",
            content
        )
    
    # Replace useAuth0() with useAuth()
    content = re.sub(
        r'const \{ (.+?) \} = useAuth0\(\);',
        r'const { \1 } = useAuth();',
        content
    )
    
    # Replace loginWithRedirect with navigate('/login')
    # First, check if useNavigate is imported
    if 'useNavigate' not in content and 'loginWithRedirect' in content:
        # Add useNavigate import
        content = re.sub(
            r"(import .+ from 'react-router-dom';)",
            r"\1",
            content
        )
        # If no react-router-dom import exists, add it
        if 'react-router-dom' not in content:
            content = re.sub(
                r"(import { useAuth } from '../contexts/useAuth';)",
                r"import { useNavigate } from 'react-router-dom';\n\1",
                content
            )
    
    # Add navigate hook if loginWithRedirect is used
    if 'loginWithRedirect' in content:
        # Add navigate hook after useAuth
        content = re.sub(
            r'(const \{[^}]+\} = useAuth\(\);)',
            r'\1\n  const navigate = useNavigate();',
            content,
            count=1
        )
        
        # Replace loginWithRedirect() calls
        content = re.sub(
            r'loginWithRedirect\(\)',
            "navigate('/login')",
            content
        )
    
    # Replace logout with custom logout
    content = re.sub(
        r'logout\(\{ returnTo: window\.location\.origin \}\)',
        'logout()',
        content
    )
    
    # Remove getAccessTokenSilently if it exists (we don't need it anymore)
    content = re.sub(
        r',?\s*getAccessTokenSilently',
        '',
        content
    )
    
    # Remove isLoading if it exists and rename to loading
    content = re.sub(
        r',?\s*isLoading:\s*authLoading',
        ', loading',
        content
    )
    content = re.sub(
        r',?\s*isLoading(?!:)',
        ', loading',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {os.path.basename(filepath)}")

print("\nAll files updated successfully!")
print("\nNote: Some files may need manual review for:")
print("  - getAccessTokenSilently usage (should use token from useAuth)")
print("  - Complex authentication flows")

Set-Location $PSScriptRoot\..

git config user.name  "Rohitbiradar12"
git config user.email "rohitbiradar394@gmail.com"

function Commit($msg) {
    git commit -m $msg
    if ($LASTEXITCODE -ne 0) { Write-Host "Nothing to commit for: $msg" }
}

git add vercel.json
Commit "added vercel config for deployment"

git add .env.example playwright.config.js
Commit "added env example and playwright setup"

git add vite.config.js eslint.config.js
Commit "updated vite and eslint config"

git add index.html
Commit "updated meta tags and page title"

git add package.json package-lock.json
Commit "updated dependencies"

git add .gitignore
Commit "updated gitignore rules"

git add src/index.css
Commit "updated global css variables and resets"

git add src/styles/
Commit "added modular css architecture for all sections"

git add src/hooks/
Commit "added custom react hooks"

git add shared/ api/
Commit "added shared utils and api routes"

git add server/
Commit "added backend server with knowledge base and groq integration"

git add src/assistant/
Commit "added AI assistant panel with chat and role comparison"

git add src/components/NavBar.jsx
Commit "redesigned navbar with glass morphism and mobile menu"

git add src/components/Button.jsx src/components/TitleHeader.jsx src/components/PinCard.jsx src/components/SceneBoundary.jsx
Commit "updated shared UI components"

git add src/components/models/
Commit "updated 3D scene models and experiences"

git add src/App.jsx
Commit "updated app root and section order"

git add src/sections/Hero.jsx
Commit "reworked hero section with new layout and animations"

git add src/sections/Projects.jsx
Commit "redesigned projects as horizontal scroll cards with AI button"

git add src/sections/Experience.jsx
Commit "revamped experience as interactive accordion timeline"

git add src/sections/About.jsx
Commit "refresh about section layout"

git add src/sections/ShowcaseSection.jsx
Commit "added galaxy particle system and cinematic achievements accordion"

git add src/sections/TechStack.jsx
Commit "updated tech stack grid with proficiency indicators"

git add src/sections/Resume.jsx
Commit "added resume section with pdf preview"

git add src/sections/Contact.jsx
Commit "updated contact section and form"

git add src/sections/Testimonials.jsx
Commit "cleaned up testimonials carousel"

git add src/sections/GameSection.jsx
Commit "added game section"

git add src/constants/index.js
Commit "updated project data and AWS internship dates"

git add public/images/worknest.webp public/images/money-mates.webp public/images/call-pilot.webp public/images/canvas.webp public/images/cogagent.webp public/images/rohit-photo.webp public/images/resume_preview.webp
Commit "added project and profile images"

git add public/images/logos/aws.webp public/images/logos/aws_logo.png public/images/torry-harris.png public/favicon-small.png
Commit "added company logos and favicon"

git add tests/ docs/ scripts/
Commit "added tests, docs and utility scripts"

git add README.md
Commit "updated readme with project overview"

Write-Host ""
Write-Host "Done. Total commits:" (git rev-list --count HEAD)
git log --oneline -35

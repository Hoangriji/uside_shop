# Fix ProductsPage useMemo null checks

$file = "src\pages\ProductsPage\ProductsPage.tsx"
$content = Get-Content $file -Raw

# Pattern: useMemo that starts with const categoryProducts without null check
$pattern = '(const available\w+ = React\.useMemo\(\(\) => \{\r?\n\s+)(const categoryProducts = selectedCategory)'
$replacement = '$1if (!products || products.length === 0) return [];' + "`r`n    " + '$2'

$content = $content -replace $pattern, $replacement

$content | Set-Content $file -NoNewline

Write-Host "Fixed ProductsPage.tsx - added null checks to useMemo"

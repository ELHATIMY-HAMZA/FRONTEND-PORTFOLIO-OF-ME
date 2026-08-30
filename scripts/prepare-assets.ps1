$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$sourceDir = 'C:\Users\Hamza\Desktop\Media Buying Proof'
$publicDir = Join-Path $PSScriptRoot '..\public\assets'
New-Item -ItemType Directory -Force -Path $publicDir | Out-Null

function Save-Crop {
  param(
    [Parameter(Mandatory)] [string] $Source,
    [Parameter(Mandatory)] [string] $Destination,
    [Parameter(Mandatory)] [int] $X,
    [Parameter(Mandatory)] [int] $Y,
    [Parameter(Mandatory)] [int] $Width,
    [Parameter(Mandatory)] [int] $Height,
    [int] $OutputWidth = 0
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  try {
    $crop = New-Object System.Drawing.Bitmap $Width, $Height
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($crop)
      try {
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($image, (New-Object System.Drawing.Rectangle 0, 0, $Width, $Height), $X, $Y, $Width, $Height, [System.Drawing.GraphicsUnit]::Pixel)
      } finally {
        $graphics.Dispose()
      }

      $final = $crop
      if ($OutputWidth -gt 0 -and $OutputWidth -lt $Width) {
        $outputHeight = [int][Math]::Round($Height * ($OutputWidth / $Width))
        $resized = New-Object System.Drawing.Bitmap $OutputWidth, $outputHeight
        $resizeGraphics = [System.Drawing.Graphics]::FromImage($resized)
        try {
          $resizeGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
          $resizeGraphics.DrawImage($crop, 0, 0, $OutputWidth, $outputHeight)
        } finally {
          $resizeGraphics.Dispose()
        }
        $final = $resized
      }

      try {
        $final.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
      } finally {
        if ($final -ne $crop) { $final.Dispose() }
      }
    } finally {
      $crop.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

# The original creative files contain client contact details in their lower halves.
# These top-section crops preserve the visible design work without publishing them.
Save-Crop -Source (Join-Path $sourceDir 'CCQQ5845.PNG') -Destination (Join-Path $publicDir 'creative-light.png') -X 0 -Y 0 -Width 1148 -Height 748 -OutputWidth 900
Save-Crop -Source (Join-Path $sourceDir 'IMG_0381.PNG') -Destination (Join-Path $publicDir 'creative-dark.png') -X 0 -Y 0 -Width 1148 -Height 718 -OutputWidth 900

# Copy the audience proof: it contains strategy details but no account ID or client contact data.
Copy-Item -LiteralPath (Join-Path $sourceDir 'Audience targeting for KSA.png') -Destination (Join-Path $publicDir 'audience-ksa.png') -Force
Copy-Item -LiteralPath 'C:\Users\Hamza\Desktop\Professionel CV Builder\output\pdf\Hamza_Elhatimy_CV_Marketing_Digital_2026_V2.pdf' -Destination (Join-Path $publicDir 'Hamza-Elhatimy-CV-2026.pdf') -Force

Write-Output "Prepared privacy-safe public assets in $publicDir"

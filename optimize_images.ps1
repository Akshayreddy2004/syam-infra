Add-Type -AssemblyName System.Drawing

$imageDir = "c:\Users\T Harish\Desktop\Syam-Infra\assets\images"
$targetSize = 1MB

# Get all large PNGs and JPGs
$largeImages = Get-ChildItem -Path $imageDir -Include *.png, *.jpg, *.jpeg -Recurse | Where-Object { $_.Length -gt $targetSize }

foreach ($imgFile in $largeImages) {
    Write-Host "Optimizing: $($imgFile.Name) ($([math]::Round($imgFile.Length / 1MB, 2)) MB)"
    
    try {
        $originalImage = [System.Drawing.Image]::FromFile($imgFile.FullName)
        
        # Calculate new dimensions (max width 1920)
        $maxWidth = 1920
        $newWidth = $originalImage.Width
        $newHeight = $originalImage.Height
        
        if ($originalImage.Width -gt $maxWidth) {
            $ratio = $maxWidth / $originalImage.Width
            $newWidth = $maxWidth
            $newHeight = [int]($originalImage.Height * $ratio)
        }
        
        # Create new bitmap
        $newImage = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
        $graphics = [System.Drawing.Graphics]::FromImage($newImage)
        
        # High quality resizing
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.DrawImage($originalImage, 0, 0, $newWidth, $newHeight)
        
        # Save to a temporary file as JPG with high compression to kill the file size
        $tempFile = $imgFile.FullName + ".tmp.jpg"
        
        # JPEG Encoder
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        # Quality 75
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75L)
        
        $newImage.Save($tempFile, $jpegCodec, $encoderParams)
        
        # Cleanup memory
        $graphics.Dispose()
        $newImage.Dispose()
        $originalImage.Dispose()
        
        # Replace original file (keep original extension to not break HTML, even if internally it's a JPG now)
        Remove-Item $imgFile.FullName -Force
        Rename-Item $tempFile -NewName $imgFile.Name
        
        $newFile = Get-Item $imgFile.FullName
        Write-Host " -> New size: $([math]::Round($newFile.Length / 1MB, 2)) MB"
    } catch {
        Write-Host "Failed to process $($imgFile.Name): $_"
    }
}
Write-Host "Optimization Complete!"

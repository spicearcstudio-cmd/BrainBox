$stream = [System.IO.File]::OpenRead('C:\Users\USER\Projects\DotsAndBoxes\build_log.gz')
$gzip = New-Object System.IO.Compression.GZipStream($stream, [System.IO.Compression.CompressionMode]::Decompress)
$reader = New-Object System.IO.StreamReader($gzip)
$content = $reader.ReadToEnd()
$reader.Close()
$gzip.Close()
$stream.Close()
$lines = $content -split "`n"
$lines[-150..-1] -join "`n"

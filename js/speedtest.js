// Simple but Reliable Speed Test Implementation
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-test');
    const statusText = document.getElementById('test-status');
    const downloadBar = document.getElementById('download-bar');
    const uploadBar = document.getElementById('upload-bar');
    const downloadSpeed = document.getElementById('download-speed');
    const uploadSpeed = document.getElementById('upload-speed');
    const pingValue = document.getElementById('ping-value');
    
    // Test configuration
    const TEST_DURATION = 5000; // 5 seconds per test
    const TEST_FILE_SIZE = 5 * 1024 * 1024; // 5MB test file
    const TEST_SERVER = window.location.hostname; // Test against local server
    
    startBtn.addEventListener('click', runSpeedTest);
    
    async function runSpeedTest() {
        try {
            // Reset UI
            startBtn.disabled = true;
            statusText.textContent = 'Initializing test...';
            resetProgressBars();
            
            // 1. Ping Test
            statusText.textContent = 'Testing ping...';
            const ping = await testPing();
            pingValue.textContent = `${ping} ms`;
            
            // 2. Download Test
            statusText.textContent = 'Testing download speed...';
            const downloadResult = await testDownloadSpeed();
            downloadSpeed.textContent = `${downloadResult.speed.toFixed(2)} Mbps`;
            
            // 3. Upload Test
            statusText.textContent = 'Testing upload speed...';
            const uploadResult = await testUploadSpeed();
            uploadSpeed.textContent = `${uploadResult.speed.toFixed(2)} Mbps`;
            
            statusText.textContent = 'Test completed!';
        } catch (error) {
            console.error('Speed test failed:', error);
            statusText.textContent = 'Test failed. Please try again.';
        } finally {
            startBtn.disabled = false;
        }
    }
    
    async function testPing() {
        const start = performance.now();
        try {
            await fetch('/');
            return Math.round(performance.now() - start);
        } catch {
            return 0;
        }
    }
    
    async function testDownloadSpeed() {
        const startTime = performance.now();
        let loadedBytes = 0;
        const testUrl = `/testfile?size=${TEST_FILE_SIZE}&t=${startTime}`;
        
        try {
            const response = await fetch(testUrl);
            const reader = response.body.getReader();
            
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                loadedBytes += value.length;
                
                const elapsed = (performance.now() - startTime) / 1000;
                const speed = (loadedBytes * 8) / (elapsed * 1024 * 1024);
                updateProgressBar(downloadBar, Math.min(1, speed / 100));
                downloadSpeed.textContent = `${speed.toFixed(2)} Mbps`;
                
                if (elapsed >= TEST_DURATION/1000) break;
            }
            
            return {
                speed: (loadedBytes * 8) / ((performance.now() - startTime) / 1000 * 1024 * 1024),
                bytes: loadedBytes
            };
        } catch (error) {
            console.error('Download test failed:', error);
            return { speed: 0, bytes: 0 };
        }
    }
    
    async function testUploadSpeed() {
        const startTime = performance.now();
        let uploadedBytes = 0;
        const chunkSize = 256 * 1024; // 256KB chunks
        
        try {
            while (performance.now() - startTime < TEST_DURATION) {
                const chunk = new Uint8Array(chunkSize).fill(0);
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: chunk,
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
                
                if (!response.ok) throw new Error('Upload failed');
                uploadedBytes += chunk.length;
                
                const elapsed = (performance.now() - startTime) / 1000;
                const speed = (uploadedBytes * 8) / (elapsed * 1024 * 1024);
                updateProgressBar(uploadBar, Math.min(1, speed / 50));
                uploadSpeed.textContent = `${speed.toFixed(2)} Mbps`;
            }
            
            return {
                speed: (uploadedBytes * 8) / ((performance.now() - startTime) / 1000 * 1024 * 1024),
                bytes: uploadedBytes
            };
        } catch (error) {
            console.error('Upload test failed:', error);
            return { speed: 0, bytes: 0 };
        }
    }
    
    function updateProgressBar(bar, percent) {
        bar.style.width = `${Math.min(100, percent * 100)}%`;
    }
    
    function resetProgressBars() {
        downloadBar.style.width = '0%';
        uploadBar.style.width = '0%';
        downloadSpeed.textContent = '0 Mbps';
        uploadSpeed.textContent = '0 Mbps';
        pingValue.textContent = '0 ms';
    }
});
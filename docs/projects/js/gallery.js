document.addEventListener('DOMContentLoaded', function() {
    fetch('images/gallery_data.json')
      .then(response => response.json())
      .then(data => {
        // Shuffle the data array
        data.sort(() => Math.random() - 0.5);
        
        const gridContainer = document.getElementById('grid-container');
        console.log(gridContainer);
        data.forEach(item => {
          const gridItem = document.createElement('div');
          gridItem.className = 'grid-item';
  
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = item.alt;
          gridItem.appendChild(img);
  
          const captionBox = document.createElement('div');
          captionBox.className = 'caption-box';
          captionBox.textContent = item.artist;
          gridItem.appendChild(captionBox);
  
          gridContainer.appendChild(gridItem);
        });
      })
      .catch(error => console.error('Error fetching the images:', error));
  });
// Initialize Google Map
function initMap() {
  try {
    const camtLocation = { lat: 18.800462196086446, lng: 98.95068887638747 };
    // Create a map
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: camtLocation,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'greedy' // Allow to use various gestures on the mobile phone
    });
    
    // Add marker to CAMT
    const marker = new google.maps.Marker({
      position: camtLocation,
      map: map,
      title: 'College of Arts, Media and Technology, Chiang Mai University',
      animation: google.maps.Animation.DROP // Add animation when loading markers
    });
    
    // Add Info Window for CAMT
    const contentString = 
      '<div id="content" style="max-width: 300px; padding: 10px;">' +
      '<h2 style="color: #800000; margin-bottom: 10px;">College of Arts, Media and Technology</h2>' +
      '<p><strong>Address:</strong> RX22+57P sukhothai 5 Alley Tambon Su Thep, Mueang Chiang Mai District Chiang Mai 50200, Thailand</p>' +
      '<p><strong>Phone:</strong> +66 53 943 014</p>' +
      '<p><strong>Email:</strong> camt@cmu.ac.th</p>' +
      '<p><strong>Website:</strong> <a href="#" style="color: #800000;">www.camt.cmu.ac.th</a></p>' +
      '</div>';
    
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    
    // Open Info Window when clicking on marker
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
    
    // Open the Info Window when the page loads.
    infowindow.open(map, marker);
    
    // No red circle as per your request
  } catch (error) {
    console.error("Error initializing map:", error);
    handleMapError();
  }
}

// Fallback function if Google Maps fails to load
function handleMapError() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.innerHTML = '<div style="height: 100%; display: flex; align-items: center; justify-content: center; background-color: #f0f0f0; border-radius: 8px;"><p>Map unavailable at the moment. Please try again later.</p></div>';
  }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
  const submitBtn = document.getElementById('submitBtn');
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const subject = document.getElementById('subject').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const recipient = document.querySelector('input[name="recipient"]').value;
      
      // Show loading state
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
      
      // Basic validation
      if (!subject || !email || !message) {
        alert('Please fill in all fields');
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
        return;
      }
      
      // Send data to server
      fetch('/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, email, message, recipient }),
      })
      .then(response => response.json())
      .then(data => {
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
        
        if (data.success) {
          alert('Thank you for your message. We will contact you soon!');
          // Clear form
          document.getElementById('subject').value = '';
          document.getElementById('email').value = '';
          document.getElementById('message').value = '';
        } else {
          alert('Error: ' + (data.message || 'Failed to send message. Please try again later.'));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        submitBtn.innerHTML = 'Submit';
        submitBtn.disabled = false;
        alert('Network error. Please check your connection and try again.');
      });
    });
  }
});
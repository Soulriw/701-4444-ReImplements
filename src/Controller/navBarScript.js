// Logo toggle
function toggleNav() {
    document.getElementById("nav").classList.toggle("hidden");
}
// Logo Toggle End

// Toggle Categories dropdown
function toggleCategoriesDropdown(event) {
    event.preventDefault(); 
    document.getElementById("categoriesDropdown").classList.toggle("show");
}

function truncateUsername(username, maxLength = 9) {
  if (username.length <= maxLength) {
    return username;
  }
  return username.substring(0, maxLength) + '..';
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      
      if (linkHref === currentPath) {
        const li = link.querySelector('li');
        if (li) {
          li.classList.add('active');
        }
      }
      
      if (currentPath === '/' && linkHref === '/') {
        const li = link.querySelector('li');
        if (li) {
          li.classList.add('active');
        }
      }
    });
  });

  async function updateCartCount() {
    try {
      const response = await fetch('/api/cart/count');
      const data = await response.json();
      
      const cartCounter = document.getElementById('cartCounter');
      if (cartCounter) {
        if (data.count > 0) {
          cartCounter.textContent = data.count;
          cartCounter.style.display = 'flex';
        } else {
          cartCounter.style.display = 'none';
        }
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  }
  
  // Update cart count when page loads
  document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setInterval(updateCartCount, 30000);
  });
  
  window.refreshCartCount = updateCartCount;
  
  document.addEventListener('cartUpdated', function() {
    updateCartCount();
  });
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'cartUpdated') {
      updateCartCount();
    }
  });
  
  // Function to trigger cart update
  function triggerCartUpdate() {
 
    document.dispatchEvent(new Event('cartUpdated'));
    localStorage.setItem('cartUpdated', Date.now());
  }

 
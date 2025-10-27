<template>
  <div class="contact-page">
    <div class="stars"></div>
    
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1 class="page-title">Contact Us</h1>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div class="contact-form">
            <h3>Send us a Message</h3>
            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="subject">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="form.subject" 
                  class="form-control"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="message">Message</label>
                <textarea 
                  id="message" 
                  v-model="form.message" 
                  class="form-control"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div v-if="message" class="message" :class="messageType">
                {{ message }}
              </div>
              
              <button 
                type="submit" 
                class="submit-btn"
                :disabled="loading"
              >
                <span v-if="loading">Sending...</span>
                <span v-else>Send Message</span>
              </button>
            </form>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="contact-info">
            <h3>Get in Touch</h3>
            
            <div class="contact-item">
              <img src="/src/model/image/contact/mail.png" alt="Email" class="contact-icon" />
              <div>
                <h4>Email</h4>
                <p>info@quadgrimoire.com</p>
              </div>
            </div>
            
            <div class="contact-item">
              <img src="/src/model/image/contact/facebook.png" alt="Facebook" class="contact-icon" />
              <div>
                <h4>Facebook</h4>
                <p>@QuadGrimoire</p>
              </div>
            </div>
            
            <div class="contact-item">
              <img src="/src/model/image/contact/twitter.png" alt="Twitter" class="contact-icon" />
              <div>
                <h4>Twitter</h4>
                <p>@QuadGrimoire</p>
              </div>
            </div>
            
            <div class="contact-item">
              <img src="/src/model/image/contact/Instagram.png" alt="Instagram" class="contact-icon" />
              <div>
                <h4>Instagram</h4>
                <p>@QuadGrimoire</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'

export default {
  name: 'Contact',
  setup() {
    const form = ref({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
    const loading = ref(false)
    const message = ref('')
    const messageType = ref('')

    const handleSubmit = async () => {
      loading.value = true
      message.value = ''
      
      try {
        const response = await axios.post('/api/contact', form.value)
        
        if (response.data.success) {
          message.value = 'Message sent successfully!'
          messageType.value = 'success'
          form.value = { name: '', email: '', subject: '', message: '' }
        } else {
          message.value = response.data.error || 'Failed to send message'
          messageType.value = 'error'
        }
      } catch (error) {
        message.value = 'An error occurred while sending the message'
        messageType.value = 'error'
      } finally {
        loading.value = false
        
        // Clear message after 5 seconds
        setTimeout(() => {
          message.value = ''
        }, 5000)
      }
    }

    return {
      form,
      loading,
      message,
      messageType,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 2rem 0;
  min-height: 80vh;
}

.page-title {
  color: #FEC564;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.contact-form h3 {
  color: #FEC564;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  color: #FEC564;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #FEC564;
  box-shadow: 0 0 0 2px rgba(254, 197, 100, 0.2);
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: #FEC564;
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(254, 197, 100, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.message.success {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.message.error {
  background: rgba(255, 0, 0, 0.2);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.contact-info {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
}

.contact-info h3 {
  color: #FEC564;
  margin-bottom: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.contact-item h4 {
  color: #FEC564;
  margin-bottom: 0.25rem;
  font-size: 1.1rem;
}

.contact-item p {
  color: #ccc;
  margin: 0;
}

@media (max-width: 768px) {
  .contact-form,
  .contact-info {
    padding: 1.5rem;
  }
}
</style>


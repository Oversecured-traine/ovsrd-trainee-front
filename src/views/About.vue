<!-- eslint-disable vue/multi-word-component-names -->
<router-view></router-view>
<template>
    <div class="main-container">
        <header class="header-section">
            <span class="logo">Task Tracker</span>
            <nav>
                <router-link class="home-link" to="/">Home</router-link>
                <router-link class="about-link" to="/about">About</router-link>
            </nav>
        </header>
        <div class="board-container">
            <div class="content-wrapper">
                <section>
                    <h1>
                        Welcome!
                    </h1>
                    <p>
                        Hello, I'm Alex, the developer behind Task Tracker. 
                        As a passionate software engineer, I created this platform with the 
                        goal of providing an efficient task management experience. 
                    </p>
                    <p>
                        With features like creating tasks in the form of cards, 
                        moving these cards, and adding images to them, 
                        you'll have everything you need to effectively manage your to-do list.
                    </p>
                    <p>
                        Main goal is to simplify your life and automate your planning.
                    </p>
                </section>
                <section>
                    <img src="../../TaskManagement-hero.png"/>
                </section>
            </div>
        </div>
    </div>
</template>
  
  
  <style scoped>

@media (max-width: 768px) {
    .content-wrapper {
      max-width: 100%;
    }
  }

  img {
    height: 50%;
    width: 100%;
  }

  h1 {
    font-family: 'Roboto', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: #f2f3f5;
    animation: fadeInUp 1s ease forwards;
    text-align: center;
  }
  
  p {
    font-size: 1.25rem;
    line-height: 1.5;
    color: #f2f3f5;
    text-align: center;
    margin-bottom: 0.5rem;

  }
  
  nav {
    padding-top: 0.5rem;
  }
  
  .home-link,
  .about-link {
    font-size: 0.875rem;
    font-weight: 500;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-radius: 0.375rem;
    text-decoration: none;
  }
  
  .home-link:hover {
    background-color: #f3f4f6;
  }
  
  .about-link:hover {
    background-color: #f3f4f6;
  }
  
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(#3b82f6, #8f31ed);
  }
  
  .board-container {
    flex: 1;
    overflow: hidden;
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-height: 100%;
    max-width: 60%;
    padding: 3rem;
    margin: 0 auto;

  }
  
  .header-section {
    flex-shrink: 0;
    display: flex;
    background-color: #ffffff;
    padding: 0.75rem 1rem;
    justify-content: space-between;
  }
  
  .logo {
    font-size: 1.75rem;
    font-weight: 900;
    letter-spacing: -0.05rem;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  
  
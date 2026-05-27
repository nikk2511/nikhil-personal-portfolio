// Global States
let typingIndex = 0;
let charIndex = 0;
let isDeleting = false;
let currentText = '';
const words = ["AI Agent Architect", "RAG & LLM Expert", "Full-Stack Developer", "LangChain/LangGraph Engineer"];
const typewriterDelay = 150;
const typewriterDeleteDelay = 75;
const typewriterNextWordDelay = 2000;

// Simulator state
let simStep = 0;
const simNodesCount = 5;
const simStatuses = [
  "Waiting to run pipeline execution... Click 'Step Forward' to begin.",
  "User Query: 'Tell me about Nikhil's AI skills.' Vector embedding generated via text-embedding-3-small.",
  "Retrieval: Queried Chroma VectorDB. Fetched 5 parent documents using hierarchical chunk retrieval.",
  "Reranking: Executed Cohere Cross-Encoder to sort chunks. Retained top 2 most contextually relevant chunks.",
  "LLM Prompt: Compiled context, prompt templates, and system instructions. Query sent to GPT-4o.",
  "Output: Successfully generated factual context-supported response with 99.8% faithfulness score!"
];

// Virtual Assistant Chat Predefined Replies
const chatResponses = {
  journey: `🎓 **Nikhil's B.Tech Journey:**<br>Nikhil completed his **Bachelor of Technology in Computer Science** at **Lloyd Institute of Engineering and Technology** (Greater Noida, UP) from August 2021 to July 2025.<br><br>During B.Tech, he focused on:<br>• Data Structures & Algorithms (200+ hours training)<br>• Operating Systems & Networking<br>• Participated in 24-hour coding marathons: **LIET Code-A-Thon** & **LIET Code-Farming**!`,
  
  skills: `🤖 **AI & Agentic Engineering Stack:**<br>Nikhil worked hard independently post-graduation to master:<br>• **LangChain:** Building modular chains, custom tools, and memory managers.<br>• **LangGraph:** Designing multi-agent stateful cyclic graphs with human-in-the-loop controls.<br>• **RAG Pipelines:** Query translation, parent-document splits, and Cohere Rerank models.<br>• **Fine-tuning:** Parameter-efficient adaptation (LoRA, QLoRA) of Llama 3 & Mistral models.<br>• **Prompt Compiler:** Prompt validation, DSPy program design, and context compression.`,
  
  projects: `🔍 **Featured Project Details:**<br><br>1. **AI Chatbot for Pooja:** A RAG-powered religious rituals assistant with a FastAPI backend and Chroma VectorDB. Lifted retrieval accuracy by 30%.<br><br>2. **Anon Chat Messaging:** A highly secure Next.js feedback space featuring custom NextAuth token validation and MongoDB schemas.<br><br>3. **Whispr:** An interactive, animation-rich dashboard showcasing clean TypeScript components and fluid layout transitions.`,
  
  certs: `🏅 **Professional Certifications:**<br>• IBM Full-Stack Software Developer<br>• Postman API Fundamentals<br>• freeCodeCamp Responsive Web Design<br>• IBM DevOps and Software Engineering<br>• IBM Computer Science Fundamentals`,
  
  fallback: `Thanks for asking! Nikhil specializes in Python, Next.js, TypeScript, FastAPI, and Advanced AI pipelines. <br><br>To discuss collaboration opportunities, feel free to use the contact form below or email him directly at **imnik2511@gmail.com**.`
};

// Initial Setup on Load
document.addEventListener("DOMContentLoaded", () => {
  // Start Typewriter
  setTimeout(typewriter, 500);

  // Setup Scroll Listeners
  window.addEventListener("scroll", handleScroll);

  // Setup Project Carousel Swipe Listeners (for mobile)
  setupCarousel();

  // Draw Simulator Paths
  setTimeout(drawSimPaths, 800);
  window.addEventListener("resize", drawSimPaths);

  // Initial Simulator Reset
  resetSim();
});

// Typewriter Engine
function typewriter() {
  const target = document.getElementById("typewriter-text");
  if (!target) return;

  const currentWord = words[typingIndex];

  if (isDeleting) {
    currentText = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    currentText = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  target.innerHTML = currentText;

  let speed = typewriterDelay;
  if (isDeleting) {
    speed = typewriterDeleteDelay;
  }

  if (!isDeleting && currentText === currentWord) {
    isDeleting = true;
    speed = typewriterNextWordDelay; // Wait at the end of the word
  } else if (isDeleting && currentText === '') {
    isDeleting = false;
    typingIndex = (typingIndex + 1) % words.length;
    speed = 500; // Small break before starting next word
  }

  setTimeout(typewriter, speed);
}

// Nav active state update on scroll
function handleScroll() {
  const header = document.getElementById("desktop-header");
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
  const scrollPos = window.scrollY + 200;

  // Header scroll glassmorphism
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  // Section highlighting
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      // Desktop Nav update
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });

      // Mobile Nav update
      mobileNavItems.forEach(item => {
        item.classList.remove("active");
        if (item.getAttribute("data-section") === id) {
          item.classList.add("active");
        }
      });
    }
  });
}

// Tab Switching logic for Core AI Explorer
function switchTab(tabName, element) {
  // Hide all contents
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach(content => content.classList.remove("active"));

  // Deactivate all buttons
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // Show active tab
  const activeTab = document.getElementById(`tab-${tabName}`);
  if (activeTab) {
    activeTab.classList.add("active");
  }

  // Activate clicked button
  if (element) {
    element.classList.add("active");
  }
}

// Simulator Line Connector Renderer (Drawing responsive vectors)
function drawSimPaths() {
  const svg = document.getElementById("sim-svg");
  if (!svg) return;

  const width = svg.clientWidth;
  const height = svg.clientHeight;

  for (let i = 0; i < simNodesCount - 1; i++) {
    const nodeA = document.getElementById(`node-${i}`);
    const nodeB = document.getElementById(`node-${i+1}`);
    const path = document.getElementById(`path-${i}`);

    if (nodeA && nodeB && path) {
      // Calculate coordinates relative to parent canvas
      const xA = nodeA.offsetLeft + (nodeA.clientWidth / 2);
      const yA = nodeA.offsetTop + (nodeA.clientHeight / 2) - 15; // Offset icon center

      const xB = nodeB.offsetLeft + (nodeB.clientWidth / 2);
      const yB = nodeB.offsetTop + (nodeB.clientHeight / 2) - 15;

      // Draw standard line path
      path.setAttribute("d", `M ${xA} ${yA} L ${xB} ${yB}`);
    }
  }
}

// Update Active Animated Connector Path
function drawActiveConnectorPath(fromIndex, toIndex) {
  const activePath = document.getElementById("active-line");
  const nodeA = document.getElementById(`node-${fromIndex}`);
  const nodeB = document.getElementById(`node-${toIndex}`);

  if (activePath && nodeA && nodeB) {
    const xA = nodeA.offsetLeft + (nodeA.clientWidth / 2);
    const yA = nodeA.offsetTop + (nodeA.clientHeight / 2) - 15;

    const xB = nodeB.offsetLeft + (nodeB.clientWidth / 2);
    const yB = nodeB.offsetTop + (nodeB.clientHeight / 2) - 15;

    activePath.setAttribute("d", `M ${xA} ${yA} L ${xB} ${yB}`);
    activePath.style.display = "block";
  }
}

// Simulator Actions
function nextSimStep() {
  if (simStep >= simNodesCount) {
    resetSim();
    return;
  }

  // If starting, activate first node
  if (simStep === 0) {
    const node = document.getElementById(`node-${simStep}`);
    node.classList.add("active");
    updateSimStatus(1);
    simStep = 1;
    return;
  }

  // Deactivate previous animated paths
  const activeLine = document.getElementById("active-line");
  if (activeLine) activeLine.style.display = "none";

  // Mark previous completed
  const prevNode = document.getElementById(`node-${simStep - 1}`);
  prevNode.classList.remove("active");
  prevNode.classList.add("completed");

  // Activate current node
  const currNode = document.getElementById(`node-${simStep}`);
  currNode.classList.add("active");

  // Draw animated line connecting them
  drawActiveConnectorPath(simStep - 1, simStep);

  // Update text descriptor
  updateSimStatus(simStep + 1);

  simStep++;

  // Handle final node state update
  if (simStep === simNodesCount) {
    const btn = document.getElementById("btn-next-step");
    if (btn) btn.innerHTML = "Restart";
  }
}

function resetSim() {
  simStep = 0;
  const activeLine = document.getElementById("active-line");
  if (activeLine) activeLine.style.display = "none";

  for (let i = 0; i < simNodesCount; i++) {
    const node = document.getElementById(`node-${i}`);
    if (node) {
      node.className = "sim-node"; // reset classes
    }
  }

  // Update button descriptor
  const btn = document.getElementById("btn-next-step");
  if (btn) btn.innerHTML = "Step Forward";

  updateSimStatus(0);
}

function updateSimStatus(step) {
  const container = document.getElementById("sim-status-text");
  if (container) {
    const numSpan = container.previousElementSibling;
    if (numSpan && numSpan.tagName === 'STRONG') {
      numSpan.innerHTML = `Step ${step}:`;
    }
    container.innerHTML = simStatuses[step];
  }
}

// Mobile Projects Swipe Carousel Helper
function setupCarousel() {
  const carousel = document.getElementById("projects-carousel");
  const indicators = document.querySelectorAll(".indicator");
  if (!carousel || indicators.length === 0) return;

  carousel.addEventListener("scroll", () => {
    const scrollPos = carousel.scrollLeft;
    const width = carousel.clientWidth;
    const cardIndex = Math.round(scrollPos / width);

    indicators.forEach((indicator, index) => {
      if (index === cardIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  });
}

function jumpCarousel(index) {
  const carousel = document.getElementById("projects-carousel");
  if (!carousel) return;

  const width = carousel.clientWidth;
  carousel.scrollTo({
    left: index * width,
    behavior: "smooth"
  });
}

// Virtual Chat Assistant Logic
function sendQuickReply(userText) {
  const input = document.getElementById("chat-user-input");
  if (!input) return;

  input.value = userText;
  handleChatSubmit(new Event('submit'));
}

function handleChatSubmit(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();

  const input = document.getElementById("chat-user-input");
  const container = document.getElementById("chat-box-container");
  if (!input || !container || input.value.trim() === '') return;

  const userText = input.value.trim();
  input.value = '';

  // Append user bubble
  appendChatBubble(userText, 'user');

  // Trigger bot reply with simulation delay
  showChatTyping(true);

  setTimeout(() => {
    showChatTyping(false);
    
    // Evaluate reply intent
    let botReply = chatResponses.fallback;
    const normalizedText = userText.toLowerCase();

    if (normalizedText.includes("b.tech") || normalizedText.includes("journey") || normalizedText.includes("education")) {
      botReply = chatResponses.journey;
    } else if (normalizedText.includes("skill") || normalizedText.includes("agent") || normalizedText.includes("langchain") || normalizedText.includes("langgraph")) {
      botReply = chatResponses.skills;
    } else if (normalizedText.includes("project") || normalizedText.includes("pooja") || normalizedText.includes("anon")) {
      botReply = chatResponses.projects;
    } else if (normalizedText.includes("cert") || normalizedText.includes("certification")) {
      botReply = chatResponses.certs;
    }

    appendChatBubble(botReply, 'bot');
  }, 1000);
}

function appendChatBubble(text, sender) {
  const container = document.getElementById("chat-box-container");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function showChatTyping(visible) {
  const container = document.getElementById("chat-box-container");
  if (!container) return;

  let typingIndicator = document.getElementById("chat-typing-indicator");

  if (visible) {
    if (!typingIndicator) {
      typingIndicator = document.createElement("div");
      typingIndicator.id = "chat-typing-indicator";
      typingIndicator.className = "chat-typing";
      typingIndicator.innerHTML = "<span></span><span></span><span></span>";
      container.appendChild(typingIndicator);
    }
    container.scrollTop = container.scrollHeight;
  } else {
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
}

// Contact Form Handler (Mock Submission)
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("form-name").value;
  const email = document.getElementById("form-email").value;
  const subject = document.getElementById("form-subject").value;
  const message = document.getElementById("form-message").value;
  const status = document.getElementById("form-status");

  if (!status) return;

  status.style.display = "block";
  status.style.color = "var(--color-cyan)";
  status.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Submitting message securely...";

  // Simulate server post
  setTimeout(() => {
    status.style.color = "#10b981";
    status.innerHTML = "<i class='fa-solid fa-check-double'></i> Thank you! Your message was sent successfully to Nikhil.";
    document.getElementById("contact-form").reset();
    
    // Hide status after 5s
    setTimeout(() => {
      status.style.display = "none";
    }, 5000);
  }, 1500);
}

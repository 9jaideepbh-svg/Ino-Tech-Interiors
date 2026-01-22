# Product Requirements Document (PRD)
## Inotech Interiors - Business Website

---

## 1. Project Overview

### 1.1 Project Name
Inotech Interiors Portfolio & Inquiry Website

### 1.2 Purpose
Create a modern, interactive business website showcasing Inotech Interiors' expertise in structural glazing, ACP cladding, and aluminum work. The website will serve as a digital portfolio, client acquisition tool, and direct communication channel.

### 1.3 Target Audience
- Commercial property developers
- Architects and interior designers
- Construction companies
- Government agencies
- Corporate clients
- Individual homeowners seeking premium glazing solutions

---

## 2. Business Context

### 2.1 Company Information
- **Business Name:** Inotech Interiors
- **Years of Experience:** 20+ years
- **Services:** Structural Glazing, ACP Cladding, Aluminum Work
- **Contact Email:** inotechinteriors@gmail.com
- **WhatsApp Business:** +91 9845284778

### 2.2 Key Differentiators
- Over two decades of industry experience
- High-profile project portfolio (HAL, City Civil Court, CM Residential House)
- Expertise across multiple glazing and cladding systems
- Professional service delivery for commercial and government projects

---

## 3. Design Requirements

### 3.1 Brand Identity

#### Color Palette
The website will use the following color scheme consistently:

| Color Code | Usage |
|------------|-------|
| `#6F1D1B` | Primary (Deep Red/Maroon) - Headers, CTAs, accents |
| `#BB9457` | Secondary (Gold/Bronze) - Highlights, borders, premium elements |
| `#432818` | Tertiary (Dark Brown) - Text, backgrounds, depth |
| `#99582A` | Accent 1 (Brown) - Supporting elements, hover states |
| `#FFE6A7` | Accent 2 (Cream/Light Gold) - Backgrounds, light sections |

#### Visual Style
- **Aesthetic:** Modern, professional, with subtle luxury touches
- **Interaction Style:** Interactive with 3D elements and smooth animations
- **Formality Level:** Business-formal with contemporary design elements
- **Inspiration:** High-end architecture portfolios, premium construction sites, interactive fashion brand websites (for movement/3D elements)

### 3.2 Interactive Elements
- **3D Models:** Incorporate rotating/interactive 3D models of glazing systems or architectural elements
- **Moving Characters/Animations:** Subtle animated elements (inspired by fashion brand websites) - could include:
  - Animated worker/architect character in hero section
  - Floating geometric shapes representing glass panels
  - Parallax scrolling effects
  - Smooth page transitions
- **Hover Effects:** Premium hover states for project cards and navigation
- **Scroll Animations:** Elements that fade/slide in as user scrolls

---

## 4. Page Structure & Content

### 4.1 Home Page

#### 4.1.1 Hero Section
- **AI-Generated Hero Image:** Modern architectural glazing visualization (to be generated)
- **Animated Character/Element:** Subtle moving character or animated geometric shapes
- **Headline:** "20+ Years of Excellence in Structural Glazing"
- **Subheadline:** Brief tagline about craftsmanship and innovation
- **Primary CTA:** "View Our Projects" / "Get a Quote"

#### 4.1.2 About Us Section
**Content Requirements:**
- Opening statement: "With over 20 years of experience in the industry..."
- Brief overview of company expertise
- Services overview:
  - Structural Glazing Solutions
  - ACP Cladding Works
  - Premium Aluminum Fabrication
  - Semi-Unitized Glazing Systems
  - Spider Glazing Systems
- Company values/approach
- Word count: 150-200 words

#### 4.1.3 Featured Projects Section
**Title:** "Our Landmark Projects"

**Project Cards (5 Featured):**
Each card should include:
- Project image placeholder (uploadable)
- Project name
- Brief 1-line description
- View details button

**Featured Projects List:**
1. **HAL (Hindustan Aeronautics Limited)**
   - Image upload slot
   - Category: Government/Aerospace Infrastructure

2. **City Civil Court, Bangalore**
   - Image upload slot
   - Category: Government/Judicial Infrastructure

3. **Chief Minister's Residential House**
   - Image upload slot
   - Category: High-Profile Residential

4. **Jyothi Institute of Technology**
   - Image upload slot
   - Category: Educational Infrastructure

5. **ITC Project**
   - Image upload slot
   - Category: Corporate/Hospitality

#### 4.1.4 Services Overview
Brief cards for each service category with icons/images:
- Structural Glazing
- ACP Cladding Works
- Semi-Unitized Glazing
- Spider Glazing System

Each card links to respective gallery page.

#### 4.1.5 Contact Section (Footer Area)
**WhatsApp Integration:**
- Prominent "Chat with Us" button/box
- WhatsApp icon with text
- Click action: Opens WhatsApp chat with +91 9845284778
- Suggested message template: "Hi, I'm interested in learning more about your glazing services."

**Email Display:**
- Email icon + inotechinteriors@gmail.com
- Clickable mailto: link

**Additional Contact Info (if applicable):**
- Office address placeholder
- Phone number
- Business hours

---

### 4.2 Project Gallery Pages (4 Categories)

Each category will have its own dedicated gallery page:

#### 4.2.1 Structural Glazing Gallery
- Grid-based image gallery
- Lightbox/modal view for enlarged images
- Image upload capability (admin)
- Filtering options (if subcategories exist)
- Project details overlay (optional)

#### 4.2.2 ACP Cladding Works Gallery
- Same structure as Structural Glazing
- Separate image collection
- Category-specific header image/description

#### 4.2.3 Semi-Unitized Glazing Gallery
- Same gallery structure
- Technical description of semi-unitized systems
- Image collection for this category

#### 4.2.4 Spider Glazing System Gallery
- Same gallery structure
- Showcase of spider glazing installations
- Emphasis on aesthetic and structural elements

**Gallery Features (All Categories):**
- Masonry/grid layout
- Lazy loading for performance
- Image optimization
- Hover effects showing project name/location
- Full-screen view option
- Navigation between categories
- Share functionality (optional)
- Download high-res option (optional, for clients)

---

### 4.3 Navigation Structure

#### Primary Navigation
- Home
- About Us
- Services (dropdown)
  - Structural Glazing
  - ACP Cladding
  - Semi-Unitized Glazing
  - Spider Glazing
- Projects/Gallery (dropdown)
  - All Projects
  - Structural Glazing
  - ACP Cladding
  - Semi-Unitized Glazing
  - Spider Glazing
- Contact

#### Sticky/Floating Elements
- WhatsApp chat button (bottom right)
- Back to top button
- Mobile hamburger menu

---

## 5. Technical Requirements

### 5.1 Technology Stack Recommendations

**Frontend:**
- **Framework:** React.js or Next.js (for better SEO and performance)
- **3D Graphics:** Three.js or React Three Fiber
- **Animations:** Framer Motion or GSAP
- **Styling:** Tailwind CSS or Styled Components
- **Image Optimization:** Next/Image or react-image-lazy-load

**Backend/CMS (For Easy Image Management):**
- **Option 1:** Headless CMS (Strapi, Contentful) for easy image uploads
- **Option 2:** Firebase Storage with simple admin panel
- **Option 3:** Static site with image management via GitHub/Netlify CMS

**Hosting:**
- Vercel, Netlify, or AWS Amplify (for static/Next.js sites)
- Firebase Hosting (if using Firebase backend)

### 5.2 Performance Requirements
- Page load time: < 3 seconds on 4G
- Mobile-optimized (responsive design)
- Image lazy loading
- Compressed assets
- SEO optimized (meta tags, structured data)

### 5.3 Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 5.4 Responsive Design
- Desktop: 1920px, 1440px, 1024px
- Tablet: 768px
- Mobile: 375px, 414px
- All layouts must be fully responsive

---

## 6. Feature Specifications

### 6.1 WhatsApp Integration
**Functionality:**
- Prominent "Chat with Us" CTA button
- Fixed position element (bottom-right corner on desktop, bottom-center on mobile)
- WhatsApp icon + text
- Click opens WhatsApp web/app with pre-filled number: +91 9845284778
- URL format: `https://wa.me/919845284778?text=Hi%2C%20I'm%20interested%20in%20learning%20more%20about%20your%20glazing%20services.`

**Design:**
- Green WhatsApp brand color (#25D366) for button
- Pulsing animation to draw attention
- Tooltip on hover: "Chat with us on WhatsApp"

### 6.2 Image Gallery System
**Admin Requirements:**
- Easy image upload interface
- Categorization by service type
- Image metadata (project name, location, date, description)
- Drag-and-drop reordering
- Bulk upload capability
- Delete/edit functionality

**User-Facing Features:**
- Grid view with responsive columns
- Lightbox modal for full-screen view
- Navigation arrows in lightbox
- Smooth transitions
- Touch gestures on mobile (swipe)
- Category filtering
- Search functionality (future phase)

### 6.3 3D Elements & Animations
**Implementation Ideas:**
1. **Hero Section 3D Model:**
   - Rotating glass panel or architectural element
   - Mouse-interactive (follows cursor slightly)
   - Auto-rotate when idle
   - Optimized for performance

2. **Animated Character/Elements:**
   - Subtle worker/architect silhouette animation
   - Geometric shapes floating (representing glass panels/building elements)
   - Parallax effect on scroll
   - Particle effects (subtle, not overwhelming)

3. **Scroll Animations:**
   - Fade-in elements
   - Slide-in from sides
   - Counter animations (years of experience, projects completed)
   - Progress bars or timelines

**Performance Considerations:**
- Lazy load 3D elements below the fold
- Reduce quality on mobile devices
- Provide option to disable animations (accessibility)

### 6.4 AI-Generated Images
**Requirements:**
- 1-2 hero images for homepage
- Category header images for each gallery section
- Background textures/patterns (if needed)
- Abstract architectural visualizations

**AI Image Prompts (to be used):**
Examples will be provided in Section 8.

---

## 7. Content Requirements

### 7.1 Text Content Needed
- [ ] Company About Us description (150-200 words)
- [ ] Service descriptions (50 words each x 4 services)
- [ ] Featured project descriptions (1-2 sentences each x 5 projects)
- [ ] Category introductions (50 words each x 4 categories)
- [ ] Contact page content
- [ ] Privacy policy / Terms of service (legal pages)

### 7.2 Visual Assets Needed
- [ ] Company logo (high-resolution, vector preferred)
- [ ] Project photos for each featured project (5 images minimum)
- [ ] Gallery photos for each category (10-20 images per category minimum)
- [ ] Team photos (optional, for About section)
- [ ] Office/workshop photos (optional)
- [ ] Certifications/awards (if applicable)

### 7.3 SEO & Marketing Content
- [ ] Meta descriptions for each page
- [ ] Keywords list
- [ ] Alt text for images
- [ ] Google My Business integration (if applicable)
- [ ] Social media links (if applicable)

---

## 8. AI Image Generation Prompts

### 8.1 Hero Section Image
```
Prompt 1 (Modern Architectural):
"Ultra-modern glass facade building exterior, structural glazing system, sleek aluminum frames, reflective glass panels catching golden hour sunlight, professional architectural photography, contemporary commercial building, clean lines, depth of field, high-end construction, 8K resolution, photorealistic"

Prompt 2 (Abstract/Artistic):
"Abstract visualization of glass panels and aluminum structures, geometric patterns, bronze and gold accents, deep maroon highlights, architectural blueprint elements in background, premium construction concept, modern and professional, cinematic lighting, 3D render style"

Prompt 3 (Worker/Human Element):
"Professional construction worker or architect silhouette inspecting modern glass building facade, structural glazing installation, golden hour lighting, professional attire, safety helmet, contemporary architecture background, inspiring and professional atmosphere, cinematic composition"
```

### 8.2 Category Header Images

**Structural Glazing:**
```
"Modern commercial building with floor-to-ceiling structural glazing system, seamless glass facade, minimal aluminum framing, urban architecture, professional photography, blue sky reflection, premium construction quality, wide-angle architectural shot, photorealistic"
```

**ACP Cladding:**
```
"Contemporary building exterior with ACP cladding panels, bronze and gold colored aluminum composite panels, modern architectural design, clean geometric patterns, professional construction photography, premium finish, commercial building facade"
```

**Semi-Unitized Glazing:**
```
"Modern office building with semi-unitized glazing system, modular glass panels, aluminum framework, professional architectural detail shot, contemporary construction, clean and professional, high-rise building, geometric precision"
```

**Spider Glazing:**
```
"Elegant spider glazing system, glass panels held by spider fittings, minimalist structural support, modern atrium or lobby, natural light streaming through, architectural detail photography, premium commercial interior, sophisticated engineering"
```

### 8.3 Background Elements
```
"Subtle geometric pattern inspired by glass panels and aluminum frames, maroon and gold color scheme, abstract architectural blueprint texture, professional background, minimal and elegant, suitable for website background"
```

---

## 9. Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Design mockups and wireframes
- [ ] Color palette implementation
- [ ] Basic page structure (HTML/React components)
- [ ] Navigation system
- [ ] Responsive layout setup
- [ ] Font selection and typography system

### Phase 2: Content Integration (Week 2-3)
- [ ] About Us section
- [ ] Featured projects section
- [ ] Service overview cards
- [ ] Contact information and email integration
- [ ] WhatsApp integration
- [ ] Footer design

### Phase 3: Gallery System (Week 3-4)
- [ ] Gallery page structure for all 4 categories
- [ ] Image upload system (admin panel)
- [ ] Lightbox functionality
- [ ] Category filtering
- [ ] Image optimization pipeline
- [ ] Mobile gallery optimization

### Phase 4: Interactive Elements (Week 4-5)
- [ ] 3D model integration
- [ ] Animated character/elements
- [ ] Scroll animations
- [ ] Hover effects
- [ ] Transition animations
- [ ] Performance optimization for animations

### Phase 5: Polish & Testing (Week 5-6)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Accessibility improvements
- [ ] User testing and feedback
- [ ] Bug fixes

### Phase 6: Deployment (Week 6)
- [ ] Domain setup
- [ ] Hosting configuration
- [ ] SSL certificate
- [ ] Google Analytics integration
- [ ] Final QA
- [ ] Launch

---

## 10. Success Metrics

### 10.1 User Engagement
- Average session duration: > 2 minutes
- Pages per session: > 3 pages
- Bounce rate: < 50%
- Mobile traffic: Track percentage and optimize accordingly

### 10.2 Business Goals
- WhatsApp inquiries per month
- Email inquiries per month
- Gallery views per project category
- Most viewed featured projects
- Traffic sources (organic, direct, referral)

### 10.3 Technical Performance
- Page load time: < 3 seconds
- Mobile performance score: > 85 (Lighthouse)
- Desktop performance score: > 90 (Lighthouse)
- SEO score: > 90 (Lighthouse)
- Accessibility score: > 90 (Lighthouse)

---

## 11. Future Enhancements (Phase 2)

### Potential Features:
- **Blog/News Section:** Company updates, industry insights, project spotlights
- **Client Testimonials:** Reviews and feedback section
- **Certifications & Awards:** Dedicated page for credentials
- **Careers Page:** Job openings and recruitment
- **Advanced Contact Form:** Multi-step inquiry form with project details
- **Live Chat:** Real-time customer support
- **Virtual Tour:** 360° views of completed projects
- **Project Timeline:** Interactive timeline of company history and major projects
- **Resource Center:** Downloadable catalogs, brochures, technical specifications
- **Multi-language Support:** If targeting diverse markets
- **Client Portal:** Login area for clients to track project progress (advanced feature)

---

## 12. Competitive Analysis & Inspiration

### Websites to Study:
1. **High-end Architecture Portfolios:**
   - Explore modern architecture firm websites
   - Note: Clean layouts, project-focused design, minimal text

2. **Construction & Glazing Companies:**
   - Analyze how competitors present their work
   - Identify gaps and opportunities for differentiation

3. **Interactive Fashion Brands:**
   - Study animation techniques
   - Evaluate how movement enhances user experience without sacrificing professionalism

4. **3D Element Integration:**
   - Look at automotive or tech product websites
   - See how 3D models enhance premium brand perception

### Differentiation Strategy:
- Combine construction industry professionalism with modern interactive design
- Balance formal business requirements with engaging user experience
- Use 3D elements tastefully to showcase technical expertise
- Premium aesthetic matching the quality of work delivered

---

## 13. Stakeholder Approvals

### Required Approvals:
- [ ] Logo approval and delivery
- [ ] Color palette confirmation
- [ ] Content review (About Us, service descriptions)
- [ ] Featured project selection and descriptions
- [ ] Image asset collection approval
- [ ] Design mockup approval
- [ ] Development phase signoff
- [ ] Pre-launch review
- [ ] Final launch approval

---

## 14. Budget & Resources Estimate

### Development Resources:
- **UI/UX Designer:** Mockups, wireframes, visual design
- **Frontend Developer:** React/Next.js development, 3D integration
- **Backend Developer (optional):** If CMS/admin panel needed
- **Content Writer:** Professional copywriting for About, services
- **Photographer (optional):** Professional project photography if needed
- **AI Image Generation:** Tools like Midjourney, DALL-E, or Stable Diffusion

### Estimated Timeline:
- **Design Phase:** 1-2 weeks
- **Development Phase:** 4-5 weeks
- **Testing & Launch:** 1 week
- **Total:** 6-8 weeks for MVP

### Hosting & Maintenance:
- Domain registration: ₹500-1000/year
- Hosting: ₹2000-5000/year (depending on provider)
- Maintenance: Ongoing updates, image additions

---

## 15. Risk Assessment

### Potential Risks:
1. **Content Delays:** Late delivery of project images or descriptions
   - Mitigation: Set clear deadlines, use placeholder content initially

2. **Performance Issues:** Heavy 3D elements slowing site
   - Mitigation: Optimize assets, lazy loading, progressive enhancement

3. **Browser Compatibility:** 3D features not working on older browsers
   - Mitigation: Feature detection, graceful degradation, fallback designs

4. **Mobile Performance:** Complex animations affecting mobile experience
   - Mitigation: Reduced animations on mobile, performance testing

5. **Scope Creep:** Additional features requested mid-development
   - Mitigation: Clear PRD, change request process, phased approach

---

## 16. Accessibility Considerations

### WCAG 2.1 Compliance:
- [ ] Keyboard navigation support
- [ ] Screen reader compatibility
- [ ] Sufficient color contrast (especially with maroon/brown palette)
- [ ] Alt text for all images
- [ ] Focus indicators on interactive elements
- [ ] Skip navigation links
- [ ] Reduced motion option for users with vestibular disorders
- [ ] Form labels and error messages
- [ ] Semantic HTML structure

---

## 17. Contact Information & Support

### Project Contacts:
- **Business Owner:** [Dad's name and contact]
- **Project Manager:** [Your contact]
- **Developer Contact:** [Developer's details once assigned]
- **Design Contact:** [Designer's details once assigned]

### Support & Maintenance:
- Post-launch support plan
- Content update procedures
- Emergency contact for technical issues
- Regular maintenance schedule

---

## 18. Appendix

### A. Glossary of Terms
- **ACP:** Aluminum Composite Panel
- **Structural Glazing:** Glass installation system where glass is bonded to frame
- **Spider Glazing:** Point-fixed glass support system using spider fittings
- **Semi-Unitized Glazing:** Modular curtain wall system
- **Responsive Design:** Website adapts to different screen sizes
- **Lazy Loading:** Images load as user scrolls to them
- **Lightbox:** Modal overlay for viewing images full-screen
- **CTA:** Call to Action

### B. Reference Links
- Color palette tool: [Adobe Color](https://color.adobe.com/)
- 3D library: [Three.js Documentation](https://threejs.org/)
- Animation library: [Framer Motion](https://www.framer.com/motion/)
- WhatsApp Business API: [WhatsApp Click to Chat](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat)

### C. Version History
- **v1.0** - Initial PRD - [Current Date]

---

## Next Steps

1. **Review this PRD** with your dad and key stakeholders
2. **Collect logo and initial project images**
3. **Approve design direction** and color palette
4. **Generate AI images** using provided prompts
5. **Begin design phase** with wireframes and mockups
6. **Set up development environment**
7. **Create content** (About Us, service descriptions)
8. **Weekly review meetings** to track progress

---

**Document Prepared By:** PRD for Inotech Interiors Website Project  
**Date:** January 22, 2026  
**Version:** 1.0  
**Status:** Draft - Pending Stakeholder Review

---

*This PRD is a living document and will be updated as the project evolves and requirements are refined.*

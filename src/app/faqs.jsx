"use client";

import React from "react";
import { Typography, Card } from "@material-tailwind/react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { Container } from "@/components";

const FAQS = [
  {
    title: "What technologies do you use?",
    desc: "I specialize in modern web technologies including React, Next.js, TypeScript, Tailwind CSS, Node.js, and various databases and cloud services.",
  },
  {
    title: "How long does a typical project take?",
    desc: "Project timelines vary based on complexity and requirements. Simple websites take 1-2 weeks, while complex applications can take 4-8 weeks or more.",
  },
  {
    title: "Do you provide ongoing support?",
    desc: "Yes, I provide ongoing support and maintenance for all projects. This includes bug fixes, updates, and technical assistance as needed.",
  },
  {
    title: "Can you work with my existing team?",
    desc: "Absolutely! I'm experienced in collaborating with existing teams and can integrate seamlessly into your development workflow.",
  },
  {
    title: "What's your development process?",
    desc: "I follow an agile approach with regular communication, code reviews, testing, and iterative development to ensure quality and timely delivery.",
  },
  {
    title: "How do you handle project requirements?",
    desc: "I start with a detailed consultation to understand your needs, create a project scope, and maintain regular communication throughout development.",
  },
];

export function Faqs() {
  const headerSection = useIntersectionObserver({ threshold: 0.2 })
  const cardsSection = useIntersectionObserver({ threshold: 0.1 })

  return (
    <Container>
      <section className="px-8 py-20">
      <div className="container max-w-6xl mx-auto">
        <div ref={headerSection.ref} className="text-center">
          <Typography 
            variant="h1" 
            color="blue-gray" 
            className={`mb-4 heading-dark heading-primary transition-all duration-700 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="lead"
            className={`mx-auto mb-24 text-contrast lg:w-3/5 transition-all duration-700 delay-200 ${headerSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
          >
            Common questions about my development services and working process. 
            Feel free to reach out if you have any other questions.
          </Typography>
        </div>

        <div ref={cardsSection.ref} className="grid gap-20 md:grid-cols-1 lg:grid-cols-3">
          {FAQS.map(({ title, desc }, index) => (
            <Card 
              key={title} 
              shadow={false} 
              color="transparent"
              className={`transition-all duration-700 ${cardsSection.isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
              style={{transitionDelay: cardsSection.isVisible ? `${index * 0.1}s` : '0s'}}
            >
              <Typography color="blue-gray" className="pb-6 heading-dark" variant="h4">
                {title}
              </Typography>
              <div className="pt-2">
                <Typography className="font-normal text-contrast">
                  {desc}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </Container>
  );
}

export default Faqs;

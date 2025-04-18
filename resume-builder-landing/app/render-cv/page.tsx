"use client";

import React from "react";
import RenderCV from "@/components/render-cv";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Get default YAML from the Flask API's default template
const initialYaml = `
cv:
  name: "John Doe"
  location: "New York, NY"
  email: "john.doe@example.com"
  phone: "+1-609-999-9995"
  website:
  social_networks:
    - network: "LinkedIn"
      username: "john.doe"
    - network: "GitHub"
      username: "john.doe"
  sections:
    summary:
      - "Experienced software engineer with a passion for building elegant, efficient solutions to complex problems."
      - "Specializing in full-stack web development with a focus on React, Node.js, and cloud technologies."
    education:
      - institution: "Stanford University"
        area: "Computer Science"
        degree: "MS"
        start_date: "2018-09"
        end_date: "2020-06"
        location: "Stanford, CA"
        highlights:
          - "GPA: 3.9/4.0"
          - "Selected for competitive research program in AI"
      - institution: "University of Michigan"
        area: "Computer Engineering"
        degree: "BS"
        start_date: "2014-09"
        end_date: "2018-05"
        location: "Ann Arbor, MI"
        highlights:
          - "Graduated with High Honors"
          - "Senior thesis on distributed systems"
    experience:
      - company: "Tech Innovations Inc."
        position: "Senior Software Engineer"
        start_date: "2022-01"
        end_date: "present"
        location: "San Francisco, CA"
        highlights:
          - "Lead developer for the company's flagship product, improving performance by 40%"
          - "Mentored junior developers and established code review processes"
          - "Implemented CI/CD pipelines that reduced deployment time by 60%"
      - company: "DataSystems LLC"
        position: "Software Engineer"
        start_date: "2020-07"
        end_date: "2021-12"
        location: "Seattle, WA"
        highlights:
          - "Developed microservices architecture for handling high-volume data processing"
          - "Optimized database queries, reducing load times by 35%"
          - "Collaborated with UX team to implement responsive design patterns"
    projects:
      - name: "Open Source Contribution - React Framework"
        start_date: "2022-03"
        end_date: "present"
        highlights:
          - "Active contributor to a popular React framework"
          - "Implemented new components and fixed critical bugs"
          - "Recognized as a top community contributor"
      - name: "Personal Project - Smart Home Dashboard"
        start_date: "2021-06"
        end_date: "2021-12"
        highlights:
          - "Built a full-stack application for monitoring and controlling smart home devices"
          - "Integrated with various IoT APIs and implemented real-time updates"
          - "Published as an open-source project with 500+ stars on GitHub"
    skills:
      - label: "Programming Languages"
        details: "JavaScript (ES6+), TypeScript, Python, Java, SQL"
      - label: "Frameworks & Libraries"
        details: "React, Node.js, Express, Next.js, Django, Spring Boot"
      - label: "Cloud & DevOps"
        details: "AWS, Docker, Kubernetes, CI/CD, Git, GitHub Actions"
      - label: "Databases"
        details: "PostgreSQL, MongoDB, Redis, ElasticSearch"
design:
  theme: "classic"
  colors:
    text: "rgb(33, 33, 33)"
    name: "rgb(0, 79, 144)"
    section_titles: "rgb(0, 79, 144)"
    links: "rgb(0, 79, 144)"
locale:
  language: "en"
`;

export default function RenderCVPage() {
  return (
    <div className="container mx-auto py-6 flex flex-col h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <RenderCV initialYaml={initialYaml} />
      </div>
      
      {/* Footer */}
      <div className="mt-6 pt-4 border-t text-center text-sm text-gray-500">
        <p>
          Powered by RenderCV, Typst, and Google Gemini | Create beautiful, AI-optimized professional resumes with YAML
        </p>
      </div>
    </div>
  );
} 
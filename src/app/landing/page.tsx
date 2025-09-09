'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CreditCard, Grid, MessageCircle, Search, User, UserPlus } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import FeatureCard from './FeatureCard'
import {useRouter} from 'next/navigation'
export default function LandingPage() {

  gsap.registerPlugin(ScrollTrigger)
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter()


  useGSAP(() => {
    // Only apply scroll animation on mobile (768px and below)
    if (window.innerWidth > 768) {
      const featureCards = gsap.utils.toArray(scrollRef.current?.children || []) as HTMLElement[];

      featureCards.forEach((featureCard) => {
        gsap.fromTo(featureCard, {
          opacity: 0,
          x: 300,
        }, {
          opacity: 1,
          scrollTrigger: {
            trigger: featureCard,
            start: 'bottom, bottom',
            end: 'top 60%',
            scrub: true,
          },
          ease: 'circ',
          x: 0,
        })
      })
    }
  }, { scope: scrollRef })

  useGSAP(() => {
    gsap.fromTo('#title', {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      y: 0,
      ease: 'power1.inOut',
      duration: 2,
    })
    gsap.fromTo('#boat', {
      x: 500,
      opacity: 0,
    }, {
      x: 0,
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut',
    })

    gsap.fromTo('#subtitle', {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut',
      delay: 0.5,
      y: 0,
    })

    gsap.fromTo('.get-started', {
      opacity: 0,
      y: 20
    }, {
      opacity: 1,
      duration: 2,
      ease: 'power2.inOut',
      delay: 1,
      y: 0,
    })

  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-row justify-center w-full sm:w-[50%]" onClick={() => router.push('/')}>
          <Image
            id="boat"
            src={'/boat.svg'}
            alt="Boat illustration"
            width={55}
            height={55}
            className="self-center opacity-0"
          />
          <p id="title" className="text-3xl font-bold self-center opacity-0 translate-y-10 cursor-pointer">rtism</p>
        </div>
        <p id="subtitle" className="text-base opacity-0 mb-[1rem]">Start your art commission journey</p>
        <div className="mb-[1rem] flex flex-row gap-x-2">
          <button className="get-started bg-white text-black px-4 py-2 rounded-card opacity-0">
            <a href="#features" className="get-started bg-white text-black px-4 py-2 rounded-card opacity-0">View Features</a>
          </button>
          <button className="get-started bg-custom-blue text-white px-4 py-2 rounded-card opacity-0" onClick={() => router.push('/login')}>Get Started</button>

        </div>
      </div>
      <div id="features" className="h-screen w-[75%] mx-auto mt-16 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 place-items-center pb-16 gap-x-4" ref={scrollRef}>
        <FeatureCard className="feature-card  " title="Message Clients" description="View art commission requests and contact potential clients quickly and easily." Icon={MessageCircle} />
        <FeatureCard className="feature-card  " title="Post Requests" description="Post public art commission requests to find the perfect artist for you." Icon={UserPlus} />
        <FeatureCard className="feature-card " title="Transactions" description="Handle transactions with 0% extra fees. We use Stripe for secure transactions." Icon={CreditCard} />
        <FeatureCard className="feature-card  " title="Profile" description="Create your profile to display your portfolio, services and reviews to potential clients." Icon={User} />
        <FeatureCard className="feature-card  " title="Dashboard" description="Track the progress of your commission requests and transactions." Icon={Grid} />
        <FeatureCard className="feature-card  " title="Search" description="Find commission requests that match your criteria. Discover artists that match your style." Icon={Search} />
      </div>
    </div>
  )
}
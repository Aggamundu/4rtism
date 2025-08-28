"use client"
import Header from "@/components/Header"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast";
import { supabaseClient } from "../../../utils/supabaseClient";

export default function Help() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleSendFeedback = async () => {
    const { data, error } = await supabaseClient
      .from('feedback')
      .insert({ feedback: feedback });
    if (error) {
      toast.error('Error sending feedback');
    } else {
      toast.success('Feedback sent successfully');
      setIsFeedbackOpen(false);
      setFeedback('');
    }
  };
  
  useEffect(() => {
    // Handle smooth scrolling with offset for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.hash) {
        e.preventDefault()
        const element = document.querySelector(target.hash)
        if (element) {
          const headerHeight = 56 // pt-14 = 3.5rem = 56px
          const windowHeight = window.innerHeight
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset
          const scrollTo = elementTop - headerHeight - (windowHeight / 2) + ((element as HTMLElement).offsetHeight / 2)

          window.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          })
        }
      }
    }

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick)
    })

    // Cleanup event listeners
    return () => {
      anchorLinks.forEach(link => {
        link.removeEventListener('click', handleAnchorClick)
      })
    }
  }, [])

  return (
    <div className="flex min-h-screen pt-14">
      <Header />
      {/* Sidebar with sections */}
      <nav className="w-64 bg-custom-darkgray px-custom hidden md:block pt-6">
        <div className="fixed">
          <ul className="space-y-3">
            <li>
              <a href="#use" className="text-gray-600 hover:text-gray-400 cursor-pointer">Why use 4rtism?</a>
            </li>
            <li>
              <a href="#payments" className="text-gray-600 hover:text-gray-400 cursor-pointer">Payment handling</a>
            </li>
            <li>
              <a href="#notified" className="text-gray-600 hover:text-gray-400 cursor-pointer">Email notifications</a>
            </li>
            <li>
              <a href="#account" className="text-gray-600 hover:text-gray-400 cursor-pointer">Do clients need an account?</a>
            </li>
            <li>
              <a href="#deletion" className="text-gray-600 hover:text-gray-400 cursor-pointer">Account deletion</a>
            </li>
            <li>
              <a href="#contact" className="text-gray-600 hover:text-gray-400 cursor-pointer">Contact Support</a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 px-custom">
        <div className="prose max-w-none pt-2">
        <div className="relative" ref={feedbackRef}>
        <button
          onClick={() => { setIsFeedbackOpen(!isFeedbackOpen);}}
          className="hidden sm:block text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200">
          Feedback
        </button>
        {isFeedbackOpen && (
          <div className="absolute right-0 w-[225px] bg-custom-gray rounded-lg shadow-lg z-50 p-[10%] mt-1">
            <textarea
              placeholder="Suggestions, bugs, secrets, messages for me, etc."
              className="w-full h-24 bg-custom-gray text-white rounded-lg p-2 border-[1px] border-white focus:outline-none text-xs"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button onClick={handleSendFeedback} className="text-xs text-white border-[1px] border-custom-lightgray hover:border-white rounded-lg px-2 py-1 transition-colors duration-200 float-right">
              Send
            </button>
          </div>
        )}
      </div>
          <section id="use" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Why should I use 4rtism?</h2>
            <p className="text-gray-400 mb-3">The only fee is the 2.9% + $0.30 transaction fee from Stripe for debit and credit cards.</p>
            <p className="text-gray-400 mb-3">I make no money from transactions, so if you have a preferred way of getting paid, like Zelle or Venmo, which have no transaction fees, I encourage you to use those instead.</p>
            <p className="text-gray-400 mb-3">However, you can use 4rtism as another avenue to receive commission requests, then handle the payment directly with the client.</p>
          </section>

          <section id="payments" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">How are payments handled?</h2>
            <p className="text-gray-400 mb-3">4rtism uses Stripe to process payments. In order to handle payments in 4rtism, you need to create a Stripe account and add your bank/payment details in the 4rtism <a className="text-custom-blue underline hover:text-blue-600" href="/dash">dashboard</a> under Stripe.</p>
            <p className="text-gray-400 mb-3">To receive payouts and view transaction history/data, login to your <a className="text-custom-blue underline hover:text-blue-600" href="https://dashboard.stripe.com/login">Stripe Dashboard</a>.</p>
            <p className="text-gray-400 mb-3">Concerning refunds, read this <a className="text-custom-blue underline hover:text-blue-600" href="https://support.stripe.com/topics/refunds">article</a> about refunds</p>
          </section>

          <section id="notified" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">How are artists and clients notified?</h2>
            <p className="text-gray-400 mb-3">All notifications are sent via email, and addressed from <span className="text-white">noreply@em6674.4rtism.com</span>.</p>
            <p className="text-gray-400 mb-3">Artists will be emailed when a new commission request is received, when a payment is received, when a submission is rejected, and when a submission is accepted.</p>
            <p className="text-gray-400 mb-3">Clients will be emailed with a link to pay for their commission, and an email to reject or accept submissions.</p>
            <p className="text-gray-400 mb-3">Make sure to check your spam folder, or mark noreply@em6674.4rtism.com as not spam, as the emails may be marked as spam.</p>
          </section>

          <section id="account" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Do clients need to create an account to send commission requests?</h2>
            <p className="text-gray-400 mb-3">No, however, they will need to enter their email address to receive a link to pay for their commission and to receive work submissions.</p>
          </section>

          <section id="deletion" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Does deleting my 4rtism account delete my Stripe account?</h2>
            <p className="text-gray-400 mb-3">No, you can still access your Stripe account after deleting your 4rtism account.</p>
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
            <p className="text-gray-400 mb-3">If you have any questions or technical issues, email me at <a href="mailto:ryancepeda2@gmail.com" className="text-custom-blue underline hover:text-blue-600">ryancepeda2@gmail.com</a></p>
          </section>
          <div className="text-sm text-right">
            HAGS - Ryan
          </div>
        </div>
      </main>
    </div>
  )
}
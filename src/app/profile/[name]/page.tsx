'use client';
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";
import { Commission, Option, Picture, Question, Review } from "../../types/Types";
import About from "./components/About";
import Banner from "./components/Banner";
import ProfileTabs from "./components/ProfileTabs";

interface ProfilePageProps {
  params: Promise<{
    name: string;
  }>;
}


export default function ProfilePage({ params }: ProfilePageProps) {
  const [name, setName] = useState<string>('');
  const { user } = useAuth();
  //Data of artist from the page
  const [profile, setProfile] = useState<any>(null);
  //UUID of profile page
  const [profileId, setProfileId] = useState<string>('');
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);


  const getProfile = async (userName: string) => {
    // Fetch profile data
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_name', userName)
      .single();

    if (error) {
      console.error(error);
    } else {
      setProfile(data);
      setProfileId(data.id);
      // Call getCommissions after profile is fetched
      getCommissions(data.id, data);
      getPictures(data.id);
      getReviews(data.id, data);
    }
  }

  const getOptions = async (questionId: number) => {
    const { data, error } = await supabaseClient
      .from('question_options')
      .select('*')
      .eq('question_id', questionId);

    if (error) {
      console.error(error);
    }
    if (data) {
      const options: Option[] = [];
      for (const option of data) {
        options.push({
          id: option.id,
          option_text: option.option_text,
          question_id: option.question_id
        });
      }
      console.log('Options:', options);
      return options;
    }
  }

  const getQuestions = async (commissionId: number) => {
    const questions: Question[] = [];
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('commission_id', commissionId);

    if (error) {
      console.error(error);
    }
    if (data) {
      return Promise.all(data.map(async (question) => ({
        id: question.id,
        question_text: question.question_text,
        type: question.type,
        is_required: question.is_required,
        options: await getOptions(question.id)
      }))).then(questions => {
        console.log('Questions:', questions);
        return questions;
      });
    }
  }

  const getCommissions = async (profileId: string, profileData: any) => {
    if (!profileId) return; // Don't query if profileId is empty

    const { data, error } = await supabaseClient
      .from('commissions')
      .select('*')
      .eq('profile_id', profileId);

    if (error) {
      console.error(error);
    } else {
      const commissions = await Promise.all(data.map(async (commission: any) => ({
        id: commission.id,
        title: commission.title,
        description: commission.description,
        price: commission.price,
        artist: commission.artist,
        image_urls: commission.image_urls,
        pfp_url: profileData.pfp_url,
        rating: commission.rating,
        delivery_days: commission.delivery_days,
        questions: await getQuestions(commission.id)
      })));
      console.log(data);
      setCommissions(commissions);
    }
  }

  const getPictures = async (profileId: string) => {
    const { data, error } = await supabaseClient
      .from('portfolios')
      .select('image_url, title')
      .eq('user_id', profileId);

    if (error) {
      console.error(error);
    } else {
      const pictures = data.map((picture: any) => ({
        pic: picture.image_url,
        title: picture.title
      }));
      setPictures(pictures);
    }
  }

  const getReviews = async (profileId: string, profileData: any) => {
    const { data, error } = await supabaseClient
      .from('reviews')
      .select('*')
      .eq('artist_id', profileId);

    if (error) {
      console.error(error);
    } else {
      const reviews = data.map((review: any) => ({
        userName: review.user_name || "Anonymous",
        reviewText: review.reviewText,
        rating: review.rating,
        date: review.created_at
      }));
      setReviews(reviews);
      console.log(reviews);
    }
  }

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      const { name } = resolvedParams;
      setName(name);
      getProfile(name);
    };

    getParams();
  }, [params]);

  const aboutProps = {
    imageSrc: profile?.pfp_url || null,
    displayName: profile?.display_name || name,
    userName: name,
    bio: profile?.biography || "",
    bannerSrc: profile?.banner_url || null
  }

  const handleProfileUpdate = async (updates: any) => {
    console.log('Profile updated:', updates);
    // Refresh the profile data after update
    await getProfile(name);
  };

  return (
    <div>
      <Header />
      <Banner imageSrc={profile?.banner_url || null} />

      <About {...aboutProps} showSettings={user?.id === profileId} onUpdateProfile={handleProfileUpdate} />
      <div className="relative top-[-3.5rem]">
        <ProfileTabs commissions={commissions} pictures={pictures} reviews={reviews} displayName={profile?.display_name || ''} />
      </div>
    </div>
  );
}
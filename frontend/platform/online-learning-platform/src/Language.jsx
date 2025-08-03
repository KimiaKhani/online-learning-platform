import React from 'react';
import { useParams } from 'react-router-dom';
import "./language.css";
import Header from './Header';
import Footer from "./Footer";
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png";

const languageData = {
  english: {
    lang: "انگلیسی",
    img: "http://www.arkaneandishe.ir/assets/pix/201905081048404080.png",
    title: `دپارتمان زبان انگلیسی با بهره‌گیری از اساتید مجرب و متدهای نوین آموزشی، آماده ارائه آموزش به گروه‌های سنی مختلف می‌باشد. دوره‌ها شامل آموزش خردسالان با استفاده از بازی، انیمیشن و آهنگ، کودکان با تمرکز بر یادگیری حروف و مکالمات ابتدایی، و نوجوانان با تمرکز بر مهارت‌های چهارگانه می‌باشد. استفاده از کتاب‌هایی مانند First Friends، Starter، و Family and Friends در کنار فعالیت‌های مکمل، محیطی پویا برای زبان‌آموزی فراهم می‌کند.`
  },
  french: {
    lang: "فرانسوی",
    img: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg",
    title: `کلاس‌های زبان فرانسوی با تمرکز بر مهارت‌های شنیداری، گفتاری و درک مطلب طراحی شده‌اند. این دوره‌ها برای علاقه‌مندان به مهاجرت، تحصیل یا یادگیری زبان دوم مناسب هستند. در آموزش از کتاب‌های معتبر مانند Alter Ego و تمرین‌های تعاملی استفاده می‌شود. زبان‌آموزان با فرهنگ فرانسه نیز آشنا می‌شوند تا یادگیری کاربردی‌تری داشته باشند.`
  },
  arabic: {
    lang: "عربی",
    img: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Egypt.svg",
    title: `دوره‌های زبان عربی با تمرکز بر مکالمه‌ی روزمره، متون دینی و رسمی برگزار می‌شوند. با استفاده از منابعی چون کتاب‌های Al-Kitab و فیلم‌های آموزشی، زبان‌آموزان با لهجه‌های مختلف عربی (مصری، لبنانی، فصیح) آشنا می‌شوند. دوره‌ها برای دانشجویان، تجار و علاقه‌مندان به فرهنگ عربی مناسب هستند.`
  },
  german: {
    lang: "آلمانی",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg",
    title: `کلاس‌های زبان آلمانی با هدف آماده‌سازی زبان‌آموزان برای مهاجرت، آزمون‌های بین‌المللی (مثل Goethe) و کار یا تحصیل در آلمان برگزار می‌شوند. سطح‌بندی دوره‌ها مطابق CEFR از A1 تا C1 بوده و از کتاب‌هایی مانند Menschen، Studio D و Sicher استفاده می‌شود. آموزش همراه با تمرین‌های گفتاری و شنیداری واقعی ارائه می‌گردد.`
  },
  turkish: {
    lang: "ترکی",
    img: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg",
    title: `آموزش زبان ترکی استانبولی با تاکید بر مکالمه و کاربرد روزمره در سفر و مهاجرت طراحی شده است. استفاده از منابع آموزشی معتبر همچون Yedi Iklim و Hitit در کنار فایل‌های صوتی و ویدیویی موجب یادگیری سریع‌تر می‌شود. آشنایی با فرهنگ ترکیه و اصطلاحات محاوره‌ای نیز بخشی از دوره است.`
  }
};


const Language = () => {
  const { lang } = useParams();
  const data = languageData[lang] || languageData["english"];

  return (
    <>
      <Header />

      <div className="mt-3">
        <div className="bgbg" style={{ backgroundColor: "rgb(63, 56, 45)", position: "relative" }}>
          <img
            src={image}
            alt="تصویر اصلی"
            className="w-100 h-25 mt-5"
            style={{
              objectFit: "inherit",
              filter: "brightness(50%)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)"
            }}
          />

          <div className="overlay-logo-text">
            <img
              src='https://logoyab.com/wp-content/uploads/2024/08/Noshirvani-University-of-Technology-Logo-1030x1030.png'
              alt="لوگو"
              className="small-logo"
            />
            <p className="logo-text ms-5">موسسه زبان نوشیروانی بابل</p>
          </div>
        </div>
      </div>

      <div className="page-title pb-5 pt-5">
        <div className="container ssd pb-5">
          <img src={data.img} alt="" className='rounded-circle' />
          <p className='ms-2'>{data.lang}</p>
        </div>
      </div>

      <div className="title-lang pb-2">
        <div className="container">
          <br />
          <p>{data.title}</p>
        </div>
      </div>

      <p className='mt-3 text-center' style={{ fontSize: "28px", fontWeight: "600" }}>
        سطوح مربوط به زبان {data.lang}
      </p>

      <div className="row mt-3 container">
        {Array.from({ length: 12 }).map((_, i) => (
          <div className="col col-4" key={i}>
            <img src={data.img} alt="" className='w-25 img-fluid tg' />
            <p className='ms-3'>سطح {i + 1}</p>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Language;

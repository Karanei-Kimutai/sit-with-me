import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      
      {/* 1. HERO SECTION */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-6 tracking-tight">
            More than just resources. <br />
            <span className="text-amber-800/60">Connection.</span>
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Sit With Me is a community centered on respectful outreach and shared storytelling with people 
            experiencing homelessness.
          </p>
        </div>
      </section>

      {/* 2. THE ORIGIN STORY - Fixed Visibility */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Why we started</h2>
          
          <p className="text-lg text-stone-700 mb-6 leading-relaxed">
            It began with a simple observation: while food and clothing drives are essential, 
            they can miss the need for genuine connection. A meal matters, and so does being heard.
          </p>
          
          <p className="text-lg text-stone-700 mb-8 leading-relaxed">
            Our founder realized that many people experiencing homelessness are often treated 
            as a problem to solve rather than people to know.
          </p>
          
          <blockquote className="border-l-4 border-amber-500 pl-6 py-4 my-10 bg-white shadow-sm rounded-r-lg">
            <p className="text-xl italic text-stone-800 font-medium leading-relaxed">
              "We wanted to build a community where the goal isn't just to give something and leave, 
              but to stay. To sit. To listen. To treat people with respect."
            </p>
          </blockquote>
          
          <p className="text-lg text-stone-700 leading-relaxed">
            That is where the name <strong className="font-bold text-stone-900">"Sit With Me"</strong> comes from. It is an invitation 
            to pause our busy lives and share a moment of genuine presence.
          </p>
        </div>
      </section>

      {/* 3. OUR CORE VALUES */}
      <section className="bg-stone-100 border-y border-stone-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900">How we make a difference</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Value 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl mb-6 text-amber-800">
                👁️
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Recognition</h3>
              <p className="text-stone-600 leading-relaxed">
                We learn names, listen carefully, and treat every interaction as a meeting between equals.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl mb-6 text-amber-800">
                🌱
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Consistency</h3>
              <p className="text-stone-600 leading-relaxed">
                Trust takes time. We show up regularly and follow through on commitments.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-2xl mb-6 text-amber-800">
                📢
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Advocacy</h3>
              <p className="text-stone-600 leading-relaxed">
                By sharing stories with care, we build understanding and reduce stigma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">Be part of the work</h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10">
          We welcome more time, skills, and steady presence. Whether you can join in person 
          or support online, there is a seat for you here.
        </p>
        <Link 
          href="/register" 
          className="btn-primary px-8 py-4 rounded-full font-medium transition-all shadow-md hover:shadow-lg inline-block"
        >
          Join Sit With Me
        </Link>
      </section>

    </main>
  );
}

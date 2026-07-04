import { motion } from 'framer-motion';
import { Tag, Calendar, Clock, Coffee } from 'lucide-react';
import sslVsTlsImg from '../../assets/ssl vs tls.jpg';

const SslVsTlsPost = () => {
  return (
    <motion.section
      key="post-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-screen h-auto lg:h-screen lg:flex-shrink-0 flex items-start justify-center px-6 md:px-12 lg:px-20 pt-14 lg:pt-18 pb-12 lg:pb-8 relative overflow-y-auto lg:overflow-hidden text-text"
    >
      <div className="w-full max-w-[48rem] h-auto lg:h-full lg:overflow-y-auto lg:no-scrollbar pt-4 pb-24 lg:pb-20">
        
        {/* Meta Info at the top */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted mb-4 uppercase tracking-wider">
          <span className="flex items-center gap-1.5 border border-border/30 rounded px-2 py-0.5 text-[10px]">
            <Tag size={10} className="text-accent" />
            Networking
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={11} />
            July 4, 2026
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            4 min read
          </span>
        </div>

        {/* Hero cover image scaled down (unconstrained borderless motion element) */}
        <motion.img
          layoutId="post-image-ssl-and-tls"
          src={sslVsTlsImg}
          alt="SSL and TLS"
          className="w-full aspect-[16/10] sm:aspect-[21/9] lg:aspect-[2.5/1] rounded-2xl object-cover mb-6"
        />

        {/* Title below image */}
        <motion.h1
          layoutId="post-title-ssl-and-tls"
          className="text-2xl md:text-3xl lg:text-4xl font-bold font-mono text-text mb-6 leading-tight tracking-tight"
        >
          SSL and TLS (and the things around them)
        </motion.h1>

        {/* Content rendering */}
        <div className="blog-content mb-16 max-w-none">
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            You're using <strong className="text-accent font-bold">SSL/TLS</strong> literally right now, to read this page safely. That's kind of the whole point of this post.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">SSL</strong> is the thing that makes your internet usage safe and secures your data.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            In a more technical sense, <strong className="text-accent font-bold">SSL (Secure Sockets Layer)</strong> is an encryption-based internet security protocol — it's the reason <strong className="text-accent font-bold">HTTPS</strong> has that "s", and any website that implements it gets to wear it.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">HTTPS</strong> good, <strong className="text-accent font-bold">HTTP</strong> bad.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85 font-semibold">
            It was first developed by <strong className="text-accent font-bold">Netscape</strong> in 1995 for ensuring a couple things, bear with me — <strong className="text-accent font-bold">privacy</strong>, <strong className="text-accent font-bold">authentication</strong> and <strong className="text-accent font-bold">data integrity</strong>.
          </p>

          <h2 className="blog-heading text-lg md:text-xl font-bold font-mono mt-8 mb-3 text-text">
            How does it work
          </h2>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            It <strong className="text-accent font-bold">encrypts</strong> the data transmitted through the web, so anyone who tampers with it just sees garbage characters.
          </p>
          <blockquote className="blog-quote border-l-3 border-accent pl-4 italic my-6 text-text/75 font-mono text-[13px] md:text-sm">
            <strong className="text-accent font-bold">encrypts</strong> here can mean using cryptographic methods to scramble and unscramble the data.
          </blockquote>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">SSL</strong> also wants to make sure you are who you say you are, so to <strong className="text-accent font-bold">authenticate</strong>, it does something called a <strong className="text-accent font-bold">handshake</strong>.
          </p>
          <blockquote className="blog-quote border-l-3 border-accent pl-4 italic my-6 text-text/75 font-mono text-[13px] md:text-sm">
            <strong className="text-accent font-bold">handshake</strong> here means a certificate — mostly a unique public key — is shared and verified between two devices. more on this later.
          </blockquote>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            The data is also <strong className="text-accent font-bold">digitally signed</strong>, mostly with a key (which is just a privately known string), so no tampering is tolerated.
          </p>
          <blockquote className="blog-quote border-l-3 border-accent pl-4 italic my-6 text-text/75 font-mono text-[13px] md:text-sm">
            in 1999 <strong className="text-accent font-bold">SSL</strong> had its Captain America steroid moment, and <strong className="text-accent font-bold">TLS</strong> was born.
          </blockquote>

          <h2 className="blog-heading text-lg md:text-xl font-bold font-mono mt-8 mb-3 text-text">
            SSL vs TLS
          </h2>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85 font-semibold text-accent">
            <strong className="text-accent font-bold">SSL</strong> is dead.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">TLS</strong> is the new king of New York. (hope you get that joke)
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">SSL</strong> is deprecated, no longer used. it had vulnerabilities. <strong className="text-accent font-bold">TLS</strong> is the new standard.
          </p>
          <blockquote className="blog-quote border-l-3 border-accent pl-4 italic my-6 text-text/75 font-mono text-[13px] md:text-sm">
            <strong className="text-accent font-bold">TLS</strong> is <strong className="text-accent font-bold">Transport Layer Security</strong>, and it does what it says. developed by the <strong className="text-accent font-bold">Internet Engineering Task Force (IETF)</strong>.
          </blockquote>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">TLS</strong> does the same job as <strong className="text-accent font-bold">SSL</strong> — encryption, authentication, data integrity — just does it smarter.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            The main difference is <strong className="text-accent font-bold">TLS</strong> negotiates which cipher/cryptographic system to use for a session between the user and the server, deciding on a fresh set of shared <a href="https://www.cloudflare.com/learning/ssl/what-is-a-cryptographic-key/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-link underline transition-colors duration-200">encryption keys</a> or <a href="https://www.cloudflare.com/learning/ssl/what-is-a-session-key/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-link underline transition-colors duration-200">session keys</a>, just for that particular session.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            Now you'd say, but how do they agree on that over the internet without anyone snooping? Valid question.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">TLS</strong> is able to set matching session keys over an unencrypted channel thanks to a technology known as <a href="https://www.cloudflare.com/learning/ssl/how-does-public-key-encryption-work/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-link underline transition-colors duration-200">public key cryptography</a>.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            Once the data is locked and loaded with security, it's signed with a <strong className="text-accent font-bold">message authentication code (MAC)</strong> and sent, nyoom.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">TLS</strong> is so optimized that implementing it doesn't take much effort. if the validation level is high though, you need to handle it properly.
          </p>

          <h2 className="blog-heading text-lg md:text-xl font-bold font-mono mt-8 mb-3 text-text">
            SSL certificates
          </h2>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">SSL/TLS</strong> can only be implemented by websites that have a registered <strong className="text-accent font-bold">SSL certificate</strong>. Think of it like an ID card — the certificate holds the public key and some more information needed for auth and encryption.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            This <strong className="text-accent font-bold">public key</strong> is used in tandem with the server's own <strong className="text-accent font-bold">private key</strong> to decrypt the data and let the devices consume it.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">SSL certificates</strong> live on a website's origin server (the site's actual home, not some cached CDN copy) and get served from there.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            Anyone can create their own <strong className="text-accent font-bold">SSL certificate</strong> (self-signed), but with no trusted authority backing it, browsers just don't trust it — kinda defeats the purpose.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            There's a few ways to slice certificate types:
          </p>
          <ul className="blog-list">
            <li className="blog-list-item">by <strong className="text-accent font-bold">domain coverage</strong>: single, wildcard, multi-domain</li>
            <li className="blog-list-item">by <strong className="text-accent font-bold">validation level</strong>: domain validation, organization validation, extended validation</li>
          </ul>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            The more thorough the check, the higher the <strong className="text-accent font-bold">validation level</strong>.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85 font-semibold">
            So how do you actually get one? Oh boy, let me tell you about a thing called common sense. You go on the web, search "how to get an SSL certificate," and get scammed by a site with a .io instead of a .com. I'm so funny.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            ...okay but for real — <strong className="text-accent font-bold">Cloudflare</strong> and <strong className="text-accent font-bold">Let's Encrypt</strong> hand these out, often for free, in a few clicks. no dark alley required.
          </p>

          <h2 className="blog-heading text-lg md:text-xl font-bold font-mono mt-8 mb-3 text-text">
            HTTPS and HTTP
          </h2>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            <strong className="text-accent font-bold">HTTP</strong> slapped with <strong className="text-accent font-bold">TLS</strong> is <strong className="text-accent font-bold">HTTPS</strong>, that's it.
          </p>
          <p className="mb-5 leading-relaxed font-mono text-[13px] md:text-sm text-text/85">
            and that's the whole trick — an encrypted handshake, a verified certificate, and a little padlock icon later, your data actually stays yours. internet safe, promise kept, larping continues.
          </p>
        </div>

        {/* Kofi / Support Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/15 mb-12 text-xs font-mono text-muted/60">
          <div className="flex items-center gap-2">
            <Coffee size={13} className="text-accent animate-pulse" />
            <span>fries & hot chocolate support coming soon.</span>
          </div>
          <span className="text-[10px] text-muted/30 uppercase tracking-widest">
            ko-fi pending
          </span>
        </div>

      </div>
    </motion.section>
  );
};

export default SslVsTlsPost;

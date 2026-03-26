import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Send, CheckCircle, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      'YOUR_PUBLIC_KEY'
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  } catch (error) {
    console.error('Failed to send email:', error);
    // optionally show an error state
  }
};

  return (
    <section id="contact" className="min-h-screen py-20 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
            Contact
          </h2>
          <div className="w-24 h-1 bg-chart-1 mx-auto"></div>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2 bg-input-background border-border focus:border-ring"
                    placeholder="Enter your name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 bg-input-background border-border focus:border-ring"
                    placeholder="Enter your email"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 bg-input-background border-border focus:border-ring min-h-32"
                    placeholder="Enter your message"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                  >
                    <span className="flex items-center gap-2">
                      Submit Message
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>

                {/* Workflow visualization */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-8 pt-6 border-t border-border"
                >
                  <div className="flex items-center justify-center gap-4">
                    <svg className="w-full max-w-md h-16" viewBox="0 0 400 60">
                      {[0, 1, 2, 3].map((i) => (
                        <g key={i}>
                          {i < 3 && (
                            <motion.line
                              x1={50 + i * 100}
                              y1="30"
                              x2={100 + i * 100}
                              y2="30"
                              stroke="var(--color-chart-2)"
                              strokeWidth="2"
                              strokeDasharray="3,3"
                              initial={{ pathLength: 0 }}
                              animate={isInView ? { pathLength: 1 } : {}}
                              transition={{ duration: 1, delay: 0.8 + i * 0.2 }}
                            />
                          )}
                          <motion.circle
                            cx={50 + i * 100}
                            cy="30"
                            r="10"
                            fill="var(--color-secondary)"
                            stroke="var(--color-chart-2)"
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            transition={{ duration: 0.3, delay: 0.8 + i * 0.15 }}
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Input → Process → Validate → Deliver
                  </p>
                </motion.div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  <CheckCircle className="w-20 h-20 text-chart-2 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-muted-foreground">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Additional contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex justify-center gap-6"
          >
            <motion.a
              href="https://www.linkedin.com/in/muhammad-shaheen-ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <Linkedin className="w-8 h-8 text-chart-1" />
            </motion.a>
            
            <motion.a
              href="mailto:mohamed.shahen.ai@gmail.com"
              className="p-4 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <Mail className="w-8 h-8 text-chart-2" />
            </motion.a>
            
            <motion.a
              href="https://wa.me/201289775133?text=Let's%20work%20together"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <svg className="w-8 h-8 text-chart-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </motion.a>
            
            <motion.a
              href="tel:+201289775133"
              className="p-4 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              whileHover={{ y: -5 }}
            >
              <Phone className="w-8 h-8 text-chart-4" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
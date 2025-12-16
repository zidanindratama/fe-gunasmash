"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_DATA = [
  {
    question: "Can beginners join?",
    answer:
      "Absolutely! We have a specialized 'Development' program designed for beginners. It focuses on fundamental techniques and basic drills. Don't be afraid to start!",
  },
  {
    question: "How much is the membership fee?",
    answer:
      "Membership fees are very affordable for students. Full pricing details can be viewed after you register for an account in the Member Area.",
  },
  {
    question: "When are the training schedules?",
    answer:
      "Regular training is held every Wednesday and Friday evening at the Campus H Sport Center. Competitive sparring sessions are held every Saturday.",
  },
  {
    question: "Do I need to bring my own racket?",
    answer:
      "We recommend bringing your own racket for comfort. However, we do provide several inventory rackets for beginners who just want to try it out.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
        <div className="md:col-span-5">
          <h2 className="font-oswald text-5xl md:text-7xl uppercase font-bold leading-[0.9] mb-6">
            Frequently <br />
            Asked <br />
            <span className="text-primary">Questions</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-sm">
            Still have doubts? Here are answers to some common questions.
          </p>
        </div>

        <div className="md:col-span-7">
          <Accordion type="single" collapsible className="w-full space-y-4 p-1">
            {FAQ_DATA.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/60 px-6 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 data-[state=open]:border-primary data-[state=open]:bg-primary/5 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-lg md:text-xl font-oswald uppercase tracking-wide py-6 hover:no-underline hover:text-primary transition-colors text-left">
                  {item.question}
                </AccordionTrigger>

                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed block">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

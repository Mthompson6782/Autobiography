# Chapter 19: The Safety Queen and the Triconex Puzzle

> *STATUS: DRAFTED — from Gemini sessions.*

---

Dr. Angela Summers lived up to the legend.

She wasn't just a boss; she was a mentor. In the world of Functional Safety, she was the oracle. Under her guidance, I relearned the philosophy of engineering. It wasn't just about making things work; it was about mathematically proving they wouldn't fail.

I studied under her, absorbing the rigorous standards of **IEC 61511**. I put in the hours and earned my **TÜV Rheinland Functional Safety Engineer Certification**.

That stamp is the gold standard. It meant I was now one of the few people on earth certified to sign off on the safety systems that keep refineries from turning into craters.

I was at the top of my game. I was making more money than I had ever seen in my life. And I was solving problems that stumped entire engineering departments.

One day, **Valero** called. They had a problem at one of their major refineries.

They needed to monitor a reactor bed with **12 thermocouples** (temperature sensors). They were using a **2oo12** (2-out-of-12) voting logic, meaning they needed to trip the system if specific conditions were met.

But here was the catch: They needed to identify the **2nd highest temperature reading**, and they needed to ensure it wasn't a duplicate value caused by a sensor fault.

And they had to do it using **Triconex**.

For the uninitiated, Triconex is a safety PLC. It is built like a tank for reliability, but its brain is intentionally simple. It doesn't have Python scripts or complex sorting algorithms. It uses basic function blocks—AND, OR, Greater Than, Less Than.

Asking a Triconex controller to sort a list of 12 dynamic variables and extract the second-highest unique value is like asking a pocket calculator to run a weather simulation.

Valero’s engineers were stuck. They thought it couldn't be done without adding an external computer (which introduces risk).

I sat down with the logic blocks. I went back to my roots—to the "Intelligence and Guile" that got me in trouble in Baltimore but made me a star in Houston.

I built a cascading sorting network using only the primitive blocks available. I created a logic structure that filtered the inputs, compared them against each other in real-time, discarded the duplicates, and floated the second-highest value to the top of the stack.

It worked perfectly.

The Valero team was amazed. I had solved a complex computational problem inside a dumb, rugged safety controller.

I was winning. I had the money, the title, the certification, and the respect of the industry's best.

And then, in the middle of this victory lap, the bill came due.

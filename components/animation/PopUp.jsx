import { motion, stagger } from 'framer-motion'

function PopUp({ children, duration, delay }) {
    const variants = {
        offscreen: {
            opacity: 0,
            y: 20
        },
        onscreen: {
            opacity: 1,
            y: 0
        }
    }

    return (
        <motion.div
            variants={variants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            transition={{
                stifness: 2000,
                // duration: 2,
                delay: delay,
                type: "spring"
            }}
        >
            {children}
        </motion.div>
    )
}

export default PopUp
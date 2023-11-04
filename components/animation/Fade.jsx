import { motion } from "framer-motion"
import { PropTypes } from 'prop-types'

function Fade({ children, delay, duration, width, margin }) {

    const variants = {
        offscreen: {
            opacity: 0,
        },
        onscreen: {
            width: width,
            opacity: 1,
            marginTop: "auto",
            marginBottom: "auto",
            marginRight: margin,
            marginLeft: margin 
        }
    }

    return (
        <motion.div 
            variants={variants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true }}
            transition={{duration: duration, delay: delay}}
        >
            {children}
        </motion.div>
    )
}


Fade.defaultProps = {
    delay: 0,
    duration: 1,
    width: "100%",
    margin: "0px"
  }
  
  Fade.propTypes = {
    delay: PropTypes.number,
    duration: PropTypes.number,
    width: PropTypes.string,
    margin: PropTypes.string
  }
  

export default Fade
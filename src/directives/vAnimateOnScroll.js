const vAnimateOnScroll = {
    mounted: (el) => {
        el.classList.add('on-scroll-hidden')

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add('on-scroll-visible')
                    observer.unobserve(el)
                }
            })
        }, {
            threshold: 0.2
        })

        observer.observe(el)
    }
}

export default vAnimateOnScroll

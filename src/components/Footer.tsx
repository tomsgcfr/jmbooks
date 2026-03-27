import styles from './Footer.module.css'
import SubscribeForm from './SubscribeForm'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.subscribeSection}>
                    <h3 className={styles.subscribeHeading}>Stay Updated</h3>
                    <p className={styles.subscribeText}>
                        Subscribe to receive new blog posts and book updates.
                    </p>
                    <SubscribeForm />
                </div>
                <p className={styles.copyright}>&copy; {new Date().getFullYear()} Jeannette Musselman. All rights reserved.</p>
            </div>
        </footer>
    )
}

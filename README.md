# Mailbox Application

A fully functional email mailbox web application built with vanilla HTML, CSS, and JavaScript featuring advanced filtering, sorting, and email management capabilities.

## Features

### Core Functionality
- **Email Management**: View, read, archive, delete, and mark emails as spam
- **Folder Organization**: Inbox, Starred, Important, Academic, Shipment, Promotional, Archive, Trash, and Spam folders
- **Search**: Real-time search across sender name, subject, snippet, and email body

### Sorting & Filtering
- **Sort by Date**: Newest First and Oldest First
- **Filter by Status**: Unread emails
- **Filter by Attachments**: View only emails with attachments
- **Sort by Sender**: Alphabetical ordering (A-Z)
- **View All**: Show all emails in current folder

### Email Features
- **Read/Unread Status**: Visual distinction with blue badge for unread emails
- **Star Emails**: Mark important emails with star icon
- **Mark as Important**: Flag emails as important with visual indicator
- **Attachment Detection**: See which emails have attachments
- **Email Details**: Full email view with sender information and formatted body

### User Experience
- **Splash Screen**: Animated envelope opening sequence with confetti
- **Pagination**: 10 emails per page with intuitive navigation
- **Responsive Layout**: Three-column layout with collapsible sidebar
- **Visual Feedback**: Color-coded status, hover effects, and smooth transitions
- **Back Navigation**: Easy navigation between email list and detail views

## File Structure

```
mailbox/
├── index.html          # HTML structure
├── script.js           # Core JavaScript functionality
├── style.css           # Styling and responsive design
└── README.md          # This file
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Flexbox layout, animations, and responsive design
- **JavaScript (ES6+)**: Event handling, DOM manipulation, and data management
- **Material Icons**: Google's icon library for UI elements

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mailbox.git
```

2. Navigate to the project directory:
```bash
cd mailbox
```

3. Open `index.html` in your web browser

### Usage

1. **Browse Emails**: Select different folders from the right sidebar
2. **Search**: Use the search bar to find specific emails
3. **Filter/Sort**: Click the filter button to apply sorting options
4. **Manage Emails**: 
   - Select multiple emails with checkboxes
   - Click Archive, Delete, or Report Spam to perform bulk actions
   - Click Mark Unread to change read status
5. **View Details**: Click any email to see full details
6. **Star/Important**: Click the star or important icons in the email list

## Features in Detail

### Sorting Options
- **All mails**: Display all emails without additional filtering
- **Unread**: Show only unread emails
- **Newest First**: Sort by date (newest to oldest)
- **Oldest First**: Sort by date (oldest to newest)
- **Sender (A-Z)**: Sort alphabetically by sender name
- **Has Attachments**: Show only emails with attachments

### Folder Navigation
- **Inbox**: Main email folder
- **Starred**: Emails marked as starred
- **Important**: Emails marked as important
- **Academic**: Academic category emails
- **Shipment**: Delivery and shipment emails
- **Promotional**: Promotional emails
- **Archive**: Archived emails
- **Trash**: Deleted emails
- **Spam**: Spam emails

### Email Actions
- **Delete**: Move email to trash (or permanently delete from trash)
- **Archive**: Move email to archive folder
- **Mark Unread**: Toggle unread status
- **Report Spam**: Move email to spam folder
- **Star**: Mark email as starred
- **Important**: Mark email as important

## Data

The application generates 200 sample emails with:
- Random senders and subjects
- Varying timestamps (last 90 days)
- Random read/unread status
- Random star and important flags
- 30% of emails have attachments
- Categorized into different folder types

## Browser Compatibility

- Chrome/Chromium
- Firefox
- Safari
- Edge

## CSS Variables

The application uses CSS custom properties for easy theming:

```css
--primary-blue: #007bff
--accent-green: #28a745
--accent-yellow: #ffe100e3
--background-light: #f8f9fa
--card-background: #e7fffde5
--text-dark: #343a40
--text-medium: #6c757d
--border-light: #e9ecef
```

## Future Enhancements

- Compose new emails
- Draft emails
- Email templates
- Multiple account support
- Local storage persistence
- Email labels/tags
- Email scheduling
- Rich text editor for compose

## License

MIT License - feel free to use this project for personal or commercial purposes

## Author

Created by Mehul Patni

## Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## Support

For issues or questions, please create an issue in the GitHub repository.

---

**Version**: 1.0.0  
**Last Updated**: November 21, 2025

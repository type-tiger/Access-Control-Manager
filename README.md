# Access Control Manager

A professional Chrome extension for configuring and testing web page access control. Create permission projects with custom groups, and control HTML elements on any website using CSS selectors and URL pattern matching.

## Overview

This extension enables precise element-level permission management through CSS selectors and URL regex patterns, making it easy to configure, test, and export permission settings for production use.

## Key Features

- **Custom Permission Projects**: Create unlimited projects with custom names and descriptions
- **Group Management**: Organize projects into custom groups for better organization
- **Multi-Selector Support**: Each project supports multiple CSS selectors separated by commas
- **URL Pattern Matching**: Use regex to control which pages each project affects
- **Import/Export**: One-click export configurations for platform integration
- **Real-time Testing**: Instantly see how your access control affects the current page
- **Multi-language**: Supports both Chinese and English interfaces

## How It Works

### CSS Selector Configuration

The extension supports powerful CSS selector combinations:

```css
/* Basic selectors */
.btn, #submit-button, [data-role="admin"]

/* Complex parent/sibling selection */
.btn.outline-red.wider.margin-top-1.fixed-width,
*:has(+ .btn.outline-red.wider.margin-top-1.fixed-width),
*:has(+ * + .btn.outline-red.wider.margin-top-1.fixed-width)
```

**Supported selector types:**

- Class selectors: `.my-class`
- ID selectors: `#my-id`
- Attribute selectors: `[data-type="admin"]`
- Complex combinations with `:has()`, sibling selectors, etc.

### URL Pattern Matching

Use regex patterns to control which pages are affected. The extension only matches the **pathname and beyond** (no protocol/domain needed):

| Pattern             | Matches          | Example                                 |
| ------------------- | ---------------- | --------------------------------------- |
| `^/settings$`       | Exact path       | `/settings` only                        |
| `^/admin`           | Path prefix      | `/admin`, `/admin/users`, etc.          |
| `.*profile.*`       | Contains keyword | `/user/profile`, `/my-profile-settings` |
| `settings\|account` | Multiple paths   | `/settings` or `/account`               |

### Access Control Behaviors

| Behavior     | CSS Effect                           | Use Case                        |
| ------------ | ------------------------------------ | ------------------------------- |
| **Hide**     | `display: none !important`           | Completely remove from view     |
| **Disable**  | `pointer-events: none; opacity: 0.3` | Visible but non-interactive     |
| **Blur**     | `filter: blur(5px) !important`       | Hide sensitive content          |
| **Restrict** | Overlay with access prompt           | Show teaser with upgrade prompt |

## Project Configuration

### Creating a Permission Project

1. **Project Name**: Unique identifier
2. **Description**: Optional description for documentation
3. **Module/Group**: Organize projects into logical groups
4. **CSS Selectors**: Multiple selectors separated by commas
5. **URL Pattern**: Regex to limit which pages are affected
6. **Behavior**: Choose how elements should be controlled

### Example Configuration

```json
{
  "name": "VIP Content Access",
  "description": "Controls access to premium content sections",
  "module": "Content Management",
  "selector": ".vip-content, .premium-section, [data-tier='premium']",
  "urlPattern": "^/(content|posts)",
  "behavior": "restrict",
  "enabled": true
}
```

## Installation & Setup

### For Chrome Extension Users

1. Clone this repository:

```bash
git clone https://github.com/type-tiger/Access-Control-Manager.git
cd access-control-chrome-extension
```

2. Install dependencies:

```bash
yarn install
```

3. Build the extension:

```bash
yarn build
```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `build` folder

### For Website Developers

No special setup required! The extension works with any website. For better compatibility:

1. Ensure elements you want to control have stable selectors
2. Add custom attributes/IDs when needed for unique identification
3. Test with the extension during development

## Export & Platform Integration

### Export Configuration

1. Configure all your permission projects
2. Click "Export" to download JSON configuration
3. Upload to your permission management platform for production use

## Extension Interface

### Main Features

- **Project List**: View all configured projects with real-time element counts
- **Group View**: Organize projects by modules/groups
- **Quick Actions**: Enable/disable projects, export configurations
- **Statistics**: See how many elements are affected on current page

### Toolbar Actions

| Button      | Function                                |
| ----------- | --------------------------------------- |
| Add Project | Create new permission project           |
| Add Module  | Create new project group                |
| Import      | Load configuration from JSON file       |
| Export      | Download current configuration          |
| Clear All   | Remove all projects (with confirmation) |

## Security Considerations

- **Client-side only**: This provides UI-level access control
- **CSS-based hiding**: Elements are hidden, not removed from DOM
- **Server-side validation required**: Always implement server-side permission checks
- **Testing tool**: This extension is for testing and configuration, not production security

## Advanced Usage

### Complex Selector Examples

```css
/* Target buttons and their parent containers */
.submit-btn, .submit-btn:parent, .form-container:has(.submit-btn)

/* Multiple related elements */
.sidebar-nav, .sidebar-nav + .content, [data-sidebar="true"]

/* Conditional selections */
.premium-feature:not(.free-tier), .vip-only[data-user-type="premium"]
```

### URL Pattern Examples

```javascript
// Exact page match
^/dashboard$

// Section-based matching
^/(admin|management|settings)

// Exclude certain paths
^/(?!public).*

// Query parameter consideration
^/search\?.*type=premium
```

## Contributing

We welcome contributions to improve the extension's functionality!

### Development Setup

```bash
# Install dependencies
yarn install

# Start development mode
yarn dev

# Build for production
yarn build
```

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/type-tiger/Access-Control-Manager/issues)
- **Documentation**: Complete usage guide available in this README

---

**Note**: This extension is actively maintained. For the latest updates and best practices, check our [release notes](https://github.com/type-tiger/Access-Control-Manager/releases).

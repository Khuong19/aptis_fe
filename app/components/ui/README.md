# UI Components

## FilterBar Component

`FilterBar` là một component tái sử dụng để tạo thanh tìm kiếm và lọc dữ liệu.

### Cách sử dụng:

```tsx
import FilterBar from '@/app/components/ui/FilterBar';

// Định nghĩa filters
const filters = [
  {
    key: 'type',
    label: 'Type',
    options: [
      { value: 'all', label: 'All Types' },
      { value: 'reading', label: 'Reading' },
      { value: 'listening', label: 'Listening' }
    ],
    value: typeFilter,
    onChange: setTypeFilter
  },
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'all', label: 'All Status' },
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' }
    ],
    value: statusFilter,
    onChange: setStatusFilter
  }
];

// Sử dụng component
<FilterBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  filters={filters}
  searchPlaceholder="Search items..."
/>
```

### Props:

- `searchTerm`: Chuỗi tìm kiếm hiện tại
- `setSearchTerm`: Function để cập nhật search term
- `filters`: Mảng các filter configuration
- `searchPlaceholder`: Placeholder cho ô tìm kiếm (optional)

### Filter Configuration:

Mỗi filter cần có:
- `key`: Unique identifier
- `label`: Label hiển thị
- `options`: Mảng các option với `value` và `label`
- `value`: Giá trị hiện tại
- `onChange`: Function để cập nhật giá trị

### Ví dụ thực tế:

Xem các file:
- `TestFilters.tsx` - Sử dụng cho Test Library
- `QuestionBankFilters.tsx` - Sử dụng cho Reading Question Bank
- `ListeningQuestionBankFilters.tsx` - Sử dụng cho Listening Question Bank 
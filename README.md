# Learning Platform Frontend

## Tổng quan
Đây là phần frontend của nền tảng học tập, được xây dựng với Next.js, TypeScript và Tailwind CSS. Dự án bao gồm các trang đăng nhập và đăng ký với giao diện người dùng hiện đại và phản hồi.

## Tính năng
- **Trang đăng nhập** với trường email, mật khẩu, ghi nhớ đăng nhập và liên kết quên mật khẩu
- **Trang đăng ký** với lựa chọn vai trò (học viên/giáo viên) và các trường thông tin cần thiết
- Thiết kế đáp ứng hoàn toàn (mobile-first)
- Các hiệu ứng chuyển đổi đẹp mắt nhờ Tailwind CSS
- Mã TypeScript đầy đủ cho an toàn kiểu dữ liệu

## Cấu trúc dự án
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── components/
│   │   └── auth/
│   │       ├── AuthLayout.tsx
│   │       ├── LoginForm.tsx
│   │       └── SignUpForm.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Cài đặt

1. Clone repository
2. Cài đặt dependencies:
```bash
cd frontend
npm install
```

3. Chạy server phát triển:
```bash
npm run dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.

## Màu sắc thương hiệu
- Trắng: #FFFFFF
- Xanh navy: #152C61 (Chính)
- Đỏ đậm: #AC292D (Phụ)

## Chi tiết triển khai
- Sử dụng Next.js App Router
- Tailwind CSS cho việc tạo kiểu
- TypeScript để đảm bảo an toàn kiểu
- Thành phần có thể tái sử dụng (AuthLayout, LoginForm, SignUpForm) 
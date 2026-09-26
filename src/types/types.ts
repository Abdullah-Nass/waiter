export interface NavbarProps {
  userName: string;
  userRole: string;
}

export interface CartItem {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
  quantity: number;
  notes?: string;
}

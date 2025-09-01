export interface User {
    id: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
  }
  
  export interface Product {
    id: number;
    name: string;
    category: string;
    unit_price: number;
    stock_quantity: number;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    token_type: string;
  }

  export interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    status: string;
    total_amount: number;
    order_batch_id: number;
    order_date: string;
    order_details: [];
  }
  
  export interface OrderItem {
    product_id: number;
    quantity: number;
  }
  
  export interface OrderCreate {
    customer_name: string;
    customer_email: string;
    items: OrderItem[];
  }
  
  export interface OrderBatchCreate {
    order_list: OrderCreate[];
  }
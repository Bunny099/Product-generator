import { create } from 'zustand';
export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { success: false, message: "Please  fill in all feild" }
        }
        const res = await fetch("/api/products",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newProduct)
            }
        )
        const data = await res.json()
        set((state) => ({ products: [...state.products, data.data] }))
        return { success: true, message: "Product created successfully" }
    },

    fetchProducts: async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        set({ products: data.data })
    },

    deleteProduct: async (pid) => {
        try {
          const res = await fetch(`/api/products/${pid}`, {
            method: "DELETE",
          });
          
          // Check if the response status is 200 (OK) or not
          if (!res.ok) {
            console.error(`Error: ${res.status} - ${res.statusText}`);
            return { success: false, message: `Failed to delete product. Status: ${res.status}` };
          }
      
          const data = await res.json();
          
          if (!data.success) {
            console.error('API error:', data.message);
            return { success: false, message: data.message };
          }
      
          // Update the UI immediately, without needing a refresh
          set((state) => ({
            products: state.products.filter((product) => (product._id !== pid)),
          }));
      
          return { success: true, message: data.message };
        } catch (error) {
          console.error('Request failed:', error);
          return { success: false, message: 'An error occurred while deleting the product.' };
        }
    },
    updateProduct: async (pid,updateProduct)=>{
        const res = await fetch(`/api/products/${pid}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(updateProduct)
        })
        const data = await res.json();
        if(!data.success) return {success:false, message:data.message};

        set((state)=>({
            products: state.products.map((product)=>(product._id === pid ? data.data : product))
        }))
    }
      
}))  
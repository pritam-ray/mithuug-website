import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Loader } from 'lucide-react';

interface ProductFormData {
  sku: string;
  name: string;
  title: string;
  description: string;
  short_desc: string;
  long_desc: string;
  price: number;
  image_url: string;
  category: string;
  weight: string;
  stock_quantity: number;
  is_new: boolean;
  is_bestseller: boolean;
  bullets: string[];
  ingredients: string[];
  nutrition_highlights: Record<string, string>;
  alt_text: string;
  meta_title: string;
  meta_description: string;
}

const emptyForm: ProductFormData = {
  sku: '',
  name: '',
  title: '',
  description: '',
  short_desc: '',
  long_desc: '',
  price: 0,
  image_url: '',
  category: 'gud-bites',
  weight: '250g',
  stock_quantity: 0,
  is_new: false,
  is_bestseller: false,
  bullets: [''],
  ingredients: [''],
  nutrition_highlights: {},
  alt_text: '',
  meta_title: '',
  meta_description: '',
};

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nutritionKey, setNutritionKey] = useState('');
  const [nutritionValue, setNutritionValue] = useState('');

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isEditMode && isAdmin) {
      loadProduct();
    }
  }, [id, isAdmin]);

  const loadProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        sku: data.sku || '',
        name: data.name || '',
        title: data.title || '',
        description: data.description || '',
        short_desc: data.short_desc || '',
        long_desc: data.long_desc || '',
        price: data.price || 0,
        image_url: data.image_url || '',
        category: data.category || 'gud-bites',
        weight: data.weight || '250g',
        stock_quantity: data.stock_quantity || 0,
        is_new: data.is_new || false,
        is_bestseller: data.is_bestseller || false,
        bullets: data.bullets || [''],
        ingredients: data.ingredients || [''],
        nutrition_highlights: data.nutrition_highlights || {},
        alt_text: data.alt_text || '',
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        bullets: formData.bullets.filter(b => b.trim()),
        ingredients: formData.ingredients.filter(i => i.trim()),
      };

      if (isEditMode && id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);

        if (error) throw error;
        alert('Product updated successfully!');
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
        alert('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(`Failed to save product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addBullet = () => setFormData({ ...formData, bullets: [...formData.bullets, ''] });
  const removeBullet = (index: number) => {
    setFormData({ ...formData, bullets: formData.bullets.filter((_, i) => i !== index) });
  };
  const updateBullet = (index: number, value: string) => {
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData({ ...formData, bullets: newBullets });
  };

  const addIngredient = () => setFormData({ ...formData, ingredients: [...formData.ingredients, ''] });
  const removeIngredient = (index: number) => {
    setFormData({ ...formData, ingredients: formData.ingredients.filter((_, i) => i !== index) });
  };
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addNutrition = () => {
    if (nutritionKey && nutritionValue) {
      setFormData({
        ...formData,
        nutrition_highlights: { ...formData.nutrition_highlights, [nutritionKey]: nutritionValue },
      });
      setNutritionKey('');
      setNutritionValue('');
    }
  };

  const removeNutrition = (key: string) => {
    const newNutrition = { ...formData.nutrition_highlights };
    delete newNutrition[key];
    setFormData({ ...formData, nutrition_highlights: newNutrition });
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ochre"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 text-chocolate-600 hover:text-chocolate-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-chocolate-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="MG-TIL-CL-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                >
                  <option value="gud-bites">Gud Bites</option>
                  <option value="trial-pack">Trial Pack</option>
                  <option value="gift-sets">Gift Sets</option>
                  <option value="traditional">Traditional</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="Classic Til-Gud Bites"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="Crispy sesame & jaggery bites made for everyday snacking"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.long_desc}
                  onChange={(e) => setFormData({ ...formData, long_desc: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="250g"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Image</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="mt-4 w-48 h-48 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Bullets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Feature Bullets</h2>
            {formData.bullets.map((bullet, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => updateBullet(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="Feature point..."
                />
                <button
                  type="button"
                  onClick={() => removeBullet(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addBullet}
              className="mt-2 px-4 py-2 bg-ochre text-white rounded-lg hover:bg-ochre-600"
            >
              Add Bullet
            </button>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Ingredients</h2>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                  placeholder="Ingredient..."
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 px-4 py-2 bg-ochre text-white rounded-lg hover:bg-ochre-600"
            >
              Add Ingredient
            </button>
          </div>

          {/* Nutrition */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Nutrition Highlights</h2>
            <div className="mb-4">
              {Object.entries(formData.nutrition_highlights).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                  <button
                    type="button"
                    onClick={() => removeNutrition(key)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nutritionKey}
                onChange={(e) => setNutritionKey(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Key (e.g., Energy)"
              />
              <input
                type="text"
                value={nutritionValue}
                onChange={(e) => setNutritionValue(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Value (e.g., 420 kcal/100g)"
              />
              <button
                type="button"
                onClick={addNutrition}
                className="px-4 py-2 bg-ochre text-white rounded-lg hover:bg-ochre-600"
              >
                Add
              </button>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <textarea
                  rows={2}
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ochre-500"
                />
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-chocolate-900 mb-4">Product Flags</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  className="w-5 h-5 text-ochre focus:ring-ochre-500"
                />
                <span className="text-gray-700">Mark as New</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_bestseller}
                  onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                  className="w-5 h-5 text-ochre focus:ring-ochre-500"
                />
                <span className="text-gray-700">Mark as Bestseller</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-ochre text-white px-6 py-3 rounded-lg hover:bg-ochre-600 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isEditMode ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

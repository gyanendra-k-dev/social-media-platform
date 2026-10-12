export default function ProductCard({ product, action }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.title} className="h-44 w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-44 items-center justify-center bg-slate-100 text-sm text-slate-400">No image</div>
      )}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <p className="mt-1 text-lg font-bold text-brand">₹{product.price}</p>
        <p className="text-xs text-slate-500">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          {product.seller?.name ? ` · Sold by ${product.seller.name}` : ""}
        </p>
        <div className="mt-auto pt-3">{action}</div>
      </div>
    </article>
  );
}

function generateQuotePDF(quote, companySettings) {
    // Import jsPDF from CDN (add this to your HTML file)
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Configurações da página
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Adicionar logo da empresa
    if (companySettings.logo) {
        doc.addImage(companySettings.logo, 'JPEG', margin, margin, 40, 20);
    }
    
    // Dados da empresa
    doc.setFontSize(10);
    doc.text(companySettings.name, pageWidth - margin, margin, { align: 'right' });
    doc.text(companySettings.address, pageWidth - margin, margin + 5, { align: 'right' });
    doc.text(companySettings.phone, pageWidth - margin, margin + 10, { align: 'right' });
    doc.text(companySettings.email, pageWidth - margin, margin + 15, { align: 'right' });
    
    // Título
    doc.setFontSize(18);
    doc.text('Proposta Comercial', pageWidth / 2, margin + 30, { align: 'center' });
    
    // Data
    const date = new Date(quote.data).toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Data: ${date}`, margin, margin + 40);
    
    // Dados do cliente
    doc.setFontSize(12);
    doc.text('Dados do Cliente', margin, margin + 50);
    doc.setFontSize(10);
    doc.text(`Nome: ${quote.nome}`, margin, margin + 60);
    doc.text(`Telefone: ${quote.telefone}`, margin, margin + 65);
    doc.text(`Localização: ${quote.cidade}/${quote.estado}`, margin, margin + 70);
    
    // Detalhes do pedido
    doc.setFontSize(12);
    doc.text('Detalhes do Pedido', margin, margin + 85);
    doc.setFontSize(10);
    
    // Quebrar o texto do pedido em linhas
    const pedidoLines = doc.splitTextToSize(quote.pedido, contentWidth);
    doc.text(pedidoLines, margin, margin + 95);
    
    // Observações
    if (quote.observacoes) {
        const currentY = doc.internal.getCurrentPageInfo().pageNumber === 1 ? 
            margin + 100 + pedidoLines.length * 5 : margin;
            
        doc.setFontSize(12);
        doc.text('Observações', margin, currentY);
        doc.setFontSize(10);
        const obsLines = doc.splitTextToSize(quote.observacoes, contentWidth);
        doc.text(obsLines, margin, currentY + 10);
    }
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
            `Página ${i} de ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }
    
    // Salvar o PDF
    doc.save(`Orçamento_${quote.nome}_${date.replace(/\//g, '-')}.pdf`);
}

// Adicionar ao objeto window para acesso global
window.generateQuotePDF = generateQuotePDF; 
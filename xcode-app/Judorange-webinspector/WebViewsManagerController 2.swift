//
//  WebViewsController.swift
//  Judorange-webinspector
//
//  Created by Julien Cuénot on 03/07/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit
import WebKit





class WebViewsManagerController:UIViewController, WebViewDelegate {

    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var webViewsManagerDelegate: WebViewsManagerDelegate?
    // ==========================================================================
    
    
    
    // DEAL WITH CHILD VIEW CONTROLLER(s) =======================================
    
    // Need to write "webViewController!.webViewDelegate = self" below
    // ==========================================================================
    
    
    
    // PROPERTIES
    var currentWebWiew = 0
    var webViewControllers:Array<WebViewController> = Array()
    
    
    
    // View did load
    override func viewDidLoad() {
        super.viewDidLoad()   // CALL SUPER
        addWebView() // 1
        addWebView() // 2
        addWebView() // 3
        addWebView() // 4
        setCurrentWebView(index: 0)
    }
    
    
    
    // Add web view
    func addWebView(){
        let  webview_count = webViewControllers.count // Get current number of webviews
        print(webview_count)
        let new_webview = WebViewController(wv_id: webview_count)  // Create webView ctrl
        webViewControllers.append( new_webview ) // Add to array
        // Allow new webview to call parent funcs with delegate
        webViewControllers[webview_count].webViewDelegate = self
        // Auto resize webview to fit view
        new_webview.webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        new_webview.webView.frame = CGRect(origin: CGPoint.zero, size: view.frame.size)
        // Start with local
        new_webview.loadLocalWebsite()
    }
    
    
    
    // Set current web view
    func setCurrentWebView(index: Int){ // loadView or viewDidLoad
        currentWebWiew = index // Set current web view property
        view = webViewControllers[index].webView
    }
    
    
    
    // Call parent view controller
    func updateBackForwardBtnStates(webView_id: Int){
        webViewsManagerDelegate?.updateBackForwardBtnStates(webView_id: webView_id)
    }
    @IBAction func updateUrlField(webView_id: Int){
        webViewsManagerDelegate?.updateUrlField(webView_id: webView_id)
    }
    func updateTabName(webView_id: Int){
        webViewsManagerDelegate?.updateTabName(webView_id: webView_id)
    }
    
    
    
    
    // EXECUTE HERE INSTEAD OF WEBVIEW CONTROLLER BECAUSE IT MODAL AND IT CANT DO IT
    func javascriptAlert(message: String) {
        
        // DEBUG
        //print("WebViewController : 'Hello, runJavaScriptAlertPanelWithMessage'")
        
        let alert = UIAlertController(title: nil, message: message, preferredStyle: .alert)
        let title = NSLocalizedString("OK", comment: "OK Button")
        
        let ok = UIAlertAction(title: title, style: .default) {
            (action: UIAlertAction) -> Void in alert.dismiss(animated: true, completion: nil)
        }
        
        alert.addAction(ok)
        present(alert, animated: true)
    }
    
    
    
} // End of class


